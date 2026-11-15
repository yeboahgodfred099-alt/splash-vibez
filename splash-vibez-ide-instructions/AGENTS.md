# SPLASH & VIBEZ — IDE Project Instructions

## 1. Your role
You are the senior frontend engineer responsible for implementing the SPLASH & VIBEZ ticketing website. Read this file and every document in `docs/` before changing code. Treat these documents as the source of truth. If an instruction conflicts with an assumption in generated code, follow these documents.

## 2. Product objective
Build a responsive, production-minded event ticketing website that lets a customer:
1. Discover the SPLASH & VIBEZ event.
2. Enter their name, Mobile Money number and WhatsApp number.
3. Optionally enter and validate a coupon code after completing those three required fields.
4. Submit registration.
5. Pay through Paystack Checkout.
6. See payment status.
7. Access a ticket only after payment has been independently verified.
8. Receive ticket details through WhatsApp using the configured n8n workflow.

The website is a frontend client. n8n and its connected database/workflows are responsible for coupon validation, authoritative price calculation, payment initialization, payment verification orchestration and ticket delivery.

## 3. Mandatory business rules
- Standard ticket price: **GH₵120**.
- Valid coupon ticket price: **GH₵100**.
- Coupon discount: **GH₵20**.
- Coupon code is optional.
- Coupon usage is unlimited. The same valid coupon may be used by multiple customers.
- Do not build a coupon usage counter, maximum-redemption field, single-use lock, decrement operation or redemption reservation.
- The three required fields are Full Name, Mobile Money Number and WhatsApp Number.
- The Mobile Money and WhatsApp numbers are independent fields. Do not auto-copy one into the other.
- Coupon validation must be available only after all three required fields are valid.
- Coupon validation is not final authorization to charge the discounted price. Revalidate the coupon in the final registration/payment-initialization workflow.
- Never trust a price, discount, coupon-valid flag, payment status or ticket status supplied by the browser.
- Do not expose n8n credentials, Paystack secret keys or other secrets in frontend code.
- Do not generate or display a valid ticket merely because the customer returned from Paystack.

## 4. Required website sections/pages
Implement these user-facing routes:
- `/` — Event landing page.
- `/register` — Registration form and coupon validation.
- `/payment-status` — Payment processing/result page. It must query the trusted backend workflow for the authoritative status.
- `/ticket` — Ticket display page. It must retrieve a ticket using a secure, unguessable ticket access token or equivalent approved backend mechanism and show it only when payment is verified.

Do not create a ticket verification page. There is no public ticket verification route in this scope.

## 5. Required project organization
Keep the project organized around the agreed structure:
- `src/pages/` — route-level page components.
- `src/components/` — reusable UI components.
- `src/services/n8nApi` — one service module for calls to the n8n integration endpoints.
- `docs/` — project and integration requirements.
- `AGENTS.md` — these governing instructions.
- `README.md` — setup and run instructions.

Use the existing framework and package manager if the repository already has them. Do not replace a working stack or add a second framework without a clear technical reason. If the repository is empty, select a modern React + TypeScript + Vite setup with a maintained router. Use semantic HTML, accessible controls and responsive CSS.

## 6. Integration rules
- All n8n URLs must come from environment variables, never be hard-coded into components.
- Provide a `.env.example` with placeholder values only. Do not commit real credentials.
- Use HTTPS endpoints in production.
- Set sensible request timeouts and handle network errors, non-2xx responses, malformed JSON and unexpected response shapes.
- Validate response data at runtime before using it.
- Do not log customer phone numbers, coupon codes, payment references, access tokens or secrets.
- Do not put sensitive customer data in query strings, analytics events or browser console logs.
- Do not assume CORS can be bypassed. Configure the n8n endpoint or a trusted server-side proxy correctly.
- If n8n webhooks are public, implement appropriate server-side abuse controls such as rate limiting, request validation and origin controls. CORS alone is not authentication.

## 7. Payment and ticket security
- The browser may request payment initialization, but the trusted n8n workflow must independently validate submitted fields and coupon code, calculate the amount in pesewas using integer arithmetic, and initialize Paystack.
- Use Paystack's expected amount unit correctly. Confirm the exact unit required by the Paystack API before implementation; do not pass a floating-point cedi value as an amount.
- The Paystack secret key must exist only in a protected server-side credential store / n8n credential. Never use a `VITE_` variable for a secret.
- The payment status page must ask the trusted workflow to verify the reference with Paystack or consume a verified server-side payment state. A URL parameter or client-side success flag is not proof.
- Prefer Paystack webhook verification with signature validation and/or server-side transaction verification. Make webhook processing idempotent.
- Only after verified successful payment may the workflow create/activate a ticket and trigger WhatsApp delivery.
- Ticket access must use a high-entropy opaque token or another secure backend authorization mechanism. Do not use sequential IDs or guessable customer details as access credentials.
- Do not expose the full customer record on the ticket page.
- A page refresh must not create a second payment or duplicate ticket.
- Never store Paystack secret keys or trusted payment state in localStorage/sessionStorage as an authority. Client storage may hold only non-authoritative UI state where appropriate.

## 8. User experience
- Design mobile-first. Many customers will use a phone.
- Make the event name, date, venue, ticket price and primary registration action immediately understandable.
- Use clear labels, helpful validation messages, loading states, disabled states and recovery actions.
- Prevent duplicate submissions while a request is in progress.
- Preserve form values during recoverable network errors where safe.
- Do not show a discounted price as confirmed until the coupon-validation endpoint returns a valid response.
- If the coupon is invalid, retain the standard price and show a clear message. Allow the customer to edit, clear and revalidate the code.
- If coupon validation fails because of a network/server error, distinguish that from an invalid coupon. Do not silently treat a technical failure as a confirmed invalid code.
- If the customer leaves the coupon blank, proceed at the standard price.
- Do not invent event details, venue facilities, contact details or policies. Use confirmed project data or clearly marked configuration placeholders.

## 9. Quality requirements
- TypeScript types for API requests and responses.
- Reusable form controls and components.
- Accessible labels, keyboard navigation, visible focus states and sufficient contrast.
- Responsive layouts for small phones, tablets and desktops.
- Basic automated tests for form validation, coupon states, API error handling and payment-status rendering.
- No dead buttons, fake success states, mock payment confirmations or placeholder links presented as working features.
- Keep business logic out of presentational components where practical.

## 10. Implementation sequence
1. Inspect the repository and report the existing stack.
2. Read all documents in `docs/`.
3. Set up routing, shared layout and design tokens.
4. Build the landing page.
5. Build the registration form and field validation.
6. Implement coupon validation with the required-field gate.
7. Implement the n8n API service and environment configuration.
8. Implement registration submission and Paystack redirect using the server response.
9. Implement authoritative payment-status lookup.
10. Implement protected ticket retrieval and display.
11. Add loading, error, empty and retry states.
12. Add tests, run lint/type checks/build, and fix errors.
13. Document required n8n webhook contracts and any unresolved deployment configuration.

Do not claim the integration is complete until the actual n8n endpoints, request/response contracts, Paystack configuration and payment verification path have been supplied and tested.
