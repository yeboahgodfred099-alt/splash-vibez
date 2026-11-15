# SPLASH & VIBEZ — n8n Integration Contract

## 1. Architecture
The frontend communicates with n8n webhooks (or a trusted backend proxy). n8n is the authority for:
- Customer input validation and normalization.
- Coupon lookup.
- Final coupon revalidation.
- Ticket price calculation.
- Paystack transaction initialization.
- Payment verification orchestration.
- Ticket issuance.
- WhatsApp ticket delivery.

The frontend must never contain Paystack secret credentials.

## 2. Environment configuration
Create `.env.example` in the project root with placeholder values:
```env
VITE_N8N_COUPON_VALIDATE_URL=https://YOUR-N8N-HOST/webhook/REPLACE-COUPON-VALIDATE
VITE_N8N_REGISTRATION_URL=https://YOUR-N8N-HOST/webhook/REPLACE-REGISTRATION
VITE_N8N_PAYMENT_STATUS_URL=https://YOUR-N8N-HOST/webhook/REPLACE-PAYMENT-STATUS
VITE_N8N_TICKET_URL=https://YOUR-N8N-HOST/webhook/REPLACE-TICKET
```

These are public endpoint URLs, not secrets. Never put Paystack secret keys, webhook signing secrets or private credentials in `VITE_` variables. Store those in n8n credentials or a secure server-side environment.

If production architecture uses a server-side proxy, configure frontend URLs to that proxy instead.

## 3. Endpoint A — Coupon validation
Purpose: check whether a coupon code is valid for this registration attempt and return the display price.

Suggested method: `POST`

Suggested request:
```json
{
  "fullName": "Customer Name",
  "mobileMoneyNumber": "+233XXXXXXXXX",
  "whatsAppNumber": "+233XXXXXXXXX",
  "couponCode": "CODE"
}
```

The frontend calls this endpoint only after the first three fields pass client validation.

Suggested successful response:
```json
{
  "success": true,
  "valid": true,
  "couponCode": "CODE",
  "currency": "GHS",
  "amount": 10000,
  "displayAmount": "100.00",
  "discount": 2000,
  "message": "Coupon applied."
}
```

Suggested invalid response:
```json
{
  "success": true,
  "valid": false,
  "currency": "GHS",
  "amount": 12000,
  "displayAmount": "120.00",
  "discount": 0,
  "message": "This coupon code is not valid."
}
```

Suggested technical error response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_SERVICE_UNAVAILABLE",
    "message": "Coupon validation is temporarily unavailable."
  }
}
```

Contract notes:
- Amount examples above are in pesewas (integer minor units), not cedis. Confirm the exact amount convention for the selected Paystack API endpoint and use it consistently.
- The endpoint must look up the code in the coupon database.
- It must not increment, decrement, reserve or consume coupon usage.
- Unlimited use means a valid code can be accepted for multiple distinct customers.
- The endpoint should return only the minimum information needed by the frontend.
- Do not expose coupon database records or internal identifiers.
- A technical error must not be returned as `valid: false`; distinguish infrastructure failure from an invalid coupon.
- The backend must define whether codes are case-sensitive. Document that policy and apply it consistently.

## 4. Endpoint B — Registration and payment initialization
Purpose: create a registration/payment attempt and initialize Paystack.

Suggested method: `POST`

Suggested request:
```json
{
  "fullName": "Customer Name",
  "mobileMoneyNumber": "+233XXXXXXXXX",
  "whatsAppNumber": "+233XXXXXXXXX",
  "couponCode": "CODE"
}
```

If no coupon is supplied, send `couponCode` as an empty string or omit it consistently according to the implemented contract.

The frontend must not send an authoritative amount. n8n must:
1. Validate and normalize all required fields again.
2. Recheck the coupon if one was supplied.
3. Calculate the final amount on the server.
4. Create a unique registration/payment-attempt record.
5. Initialize Paystack using a protected credential.
6. Return the authorization URL and payment reference.

Suggested success response:
```json
{
  "success": true,
  "registrationId": "server-generated-id",
  "paymentReference": "PAYSTACK_REFERENCE",
  "currency": "GHS",
  "amount": 10000,
  "displayAmount": "100.00",
  "authorizationUrl": "https://checkout.paystack.com/...",
  "statusUrl": "https://YOUR-SITE/payment-status"
}
```

For no coupon or invalid coupon, the server-calculated amount is the standard GH₵120 (12000 pesewas in this illustrative contract). For a valid coupon, it is GH₵100 (10000 pesewas).

Important price-change rule:
- The frontend should compare the final server-calculated amount with the amount currently shown to the customer.
- If they differ, do not redirect to Paystack automatically. Display the updated amount and ask the customer to confirm submission again.
- The backend should support a safe way to confirm/reuse the registration attempt without creating duplicate attempts or transactions. Define this behavior before implementation.

## 5. Endpoint C — Payment status
Purpose: retrieve the authoritative payment result.

Suggested method: `GET` or `POST`, depending on the deployment's security design. Prefer POST if sending sensitive identifiers in the body.

Suggested request:
```json
{
  "paymentReference": "PAYSTACK_REFERENCE"
}
```

Suggested response while pending:
```json
{
  "success": true,
  "paymentStatus": "pending",
  "ticketStatus": "not_issued"
}
```

Suggested response after verified payment:
```json
{
  "success": true,
  "paymentStatus": "success",
  "ticketStatus": "issued",
  "ticketAccessToken": "HIGH_ENTROPY_OPAQUE_TOKEN"
}
```

Suggested response after failure:
```json
{
  "success": true,
  "paymentStatus": "failed",
  "ticketStatus": "not_issued"
}
```

Contract notes:
- Do not trust a status parameter supplied by the browser.
- n8n must look up the stored transaction and verify the reference with Paystack or use a correctly authenticated, verified webhook result.
- A browser return URL is not evidence of payment.
- Verify that the paid amount and currency match the stored registration/payment attempt.
- Treat repeated status requests safely; they must not create duplicate tickets.
- Do not return customer phone numbers or unrelated personal information.

## 6. Endpoint D — Ticket retrieval
Purpose: return ticket details only for an authorized ticket access token.

Suggested method: `POST`

Suggested request:
```json
{
  "ticketAccessToken": "HIGH_ENTROPY_OPAQUE_TOKEN"
}
```

Suggested response:
```json
{
  "success": true,
  "ticket": {
    "ticketId": "SV-UNGUESSABLE-ID",
    "eventName": "SPLASH & VIBEZ",
    "eventDate": "2026-12-12",
    "venue": "Triple Hill Hotel",
    "holderName": "Customer Name",
    "status": "valid"
  }
}
```

Contract notes:
- The access token must be generated securely and be unguessable.
- Do not use phone number, name, sequential database ID or payment reference alone as ticket authorization.
- The workflow must confirm that payment is verified and the ticket is issued before returning ticket data.
- Return only fields required to display the ticket.
- Do not create a public ticket verification endpoint as part of this project.

## 7. Paystack requirements
- Store the Paystack secret key in n8n's protected credentials.
- Initialize transactions from the trusted n8n workflow.
- Use the exact amount unit required by Paystack (normally the smallest currency unit for the selected currency/API); use integer arithmetic.
- Verify the transaction server-side.
- Validate Paystack webhook signatures using the official method and secret key if webhooks are used.
- Match reference, amount, currency and transaction status to the stored attempt.
- Make webhook processing idempotent.
- Do not issue a ticket until payment is verified as successful.
- Do not rely on the customer redirect as payment confirmation.

## 8. WhatsApp delivery
After verified payment and successful ticket issuance:
- Send the ticket details to the submitted WhatsApp number.
- Use the WhatsApp provider/account already configured in the n8n workflow.
- Record delivery outcome and retry safely where appropriate.
- Avoid creating a second ticket when retrying a failed WhatsApp delivery.
- The frontend should not claim the message has been delivered unless the backend reports that result. It may say that ticket delivery has been initiated if that is what the workflow confirms.

## 9. Operational and security requirements
- Validate all incoming fields on the server.
- Apply rate limiting and abuse protection to public webhook endpoints.
- Use HTTPS.
- Configure CORS for the real website origin; do not treat CORS as authentication.
- Use idempotency for payment initialization where feasible, payment confirmation, ticket creation and WhatsApp delivery.
- Keep secrets in n8n credentials.
- Avoid logging full customer data, coupon codes, access tokens or credentials.
- Define data retention and access controls for customer records.
- Return consistent JSON and meaningful HTTP status codes.
- Do not expose stack traces or internal workflow details to the browser.

## 10. Before frontend integration is considered complete
The project owner must supply/confirm:
- Actual deployed webhook URLs.
- Exact request/response schemas used by the deployed n8n workflows.
- Coupon code normalization and case-sensitivity policy.
- Paystack currency/amount configuration.
- Paystack callback URL and webhook setup.
- Secure ticket-access-token issuance and retrieval design.
- WhatsApp provider and delivery response contract.

Until those are supplied, implement typed service interfaces and clearly marked environment placeholders. Do not invent working endpoints or simulate successful payments.
