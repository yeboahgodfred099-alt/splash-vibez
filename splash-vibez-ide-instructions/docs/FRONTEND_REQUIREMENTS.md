# SPLASH & VIBEZ — Frontend Requirements

## 1. General implementation
Build a polished, responsive, mobile-first event ticketing interface. Use the repository's existing framework if present. If starting from an empty repository, use React, TypeScript and Vite with a maintained routing solution.

Keep the UI componentized. Suggested components:
- `EventHero`
- `EventDetails`
- `RegistrationForm`
- `CouponValidator`
- `PriceSummary`
- `PaymentStatus`
- `TicketDetails`
- shared `Button`, `Input`, `FormField`, `Alert`, `Spinner` and layout components as useful.

Suggested page files:
- `src/pages/Home.tsx`
- `src/pages/Registration.tsx`
- `src/pages/PaymentStatus.tsx`
- `src/pages/Ticket.tsx`

Suggested component files:
- `src/components/EventHero.tsx`
- `src/components/EventDetails.tsx`
- `src/components/RegistrationForm.tsx`
- `src/components/CouponValidator.tsx`
- `src/components/PriceSummary.tsx`
- `src/components/PaymentStatus.tsx`

Suggested integration file:
- `src/services/n8nApi.ts`

Adapt file extensions to the existing project conventions.

## 2. Landing page `/`
Purpose: introduce SPLASH & VIBEZ and direct visitors to registration.

Required content:
- SPLASH & VIBEZ event name.
- Triple Hill Hotel.
- Saturday, 12 December 2026.
- 8:00 PM – 3:00 AM.
- A clear ticket price presentation consistent with the current pricing rules: GH₵120 standard; GH₵100 with a valid coupon.
- Primary CTA: “Get Your Ticket” or equivalent, linking to `/register`.

The landing page may include approved event imagery and event-experience details from the project brief. Do not invent facilities, claims or policies. Optimize images and provide meaningful alt text.

## 3. Registration page `/register`
### Form fields
Render exactly these four customer inputs:
1. Full Name
2. Mobile Money Number
3. WhatsApp Number
4. Coupon Code (optional)

Do not add email, address, ticket type, quantity or unrelated fields.

### Required-field gate
- Full Name, Mobile Money Number and WhatsApp Number must all be valid before coupon validation can be attempted.
- Before all three fields are valid, disable the coupon input and Validate button, or clearly keep the coupon section unavailable with a helpful explanation.
- When the three fields become valid, enable coupon entry and validation.
- Coupon Code remains optional. The customer may submit without a coupon.
- Validate the three required fields on the client for usability, and repeat validation on the server.

### Phone-number UX
- Label the fields distinctly: “Mobile Money Number” and “WhatsApp Number”.
- Do not auto-fill one number from the other.
- Accept the configured Ghanaian local/international formats and normalize before API submission.
- Show a clear inline error for malformed numbers.
- Do not display a full number in debug messages or analytics.

### Coupon states
Implement explicit states:
- `locked`: one or more required fields are missing/invalid.
- `idle`: required fields are valid; no coupon validation has been attempted.
- `validating`: request in progress; prevent duplicate validation.
- `valid`: server confirmed coupon; show GH₵100 and a success message.
- `invalid`: server rejected code; show GH₵120 and a concise error.
- `error`: network/server/response error; explain that validation could not be completed and offer retry.

When coupon is edited or cleared after validation, invalidate the previous result immediately and return to `idle`. Never keep showing GH₵100 for a changed code.

If the coupon is blank:
- Do not call the validation endpoint.
- Keep the standard price at GH₵120.
- Allow registration submission.

### Price summary
- Initial/default price: GH₵120.
- Valid coupon price: GH₵100.
- Display the discount as GH₵20 where appropriate.
- The frontend display is indicative only. The final registration response from n8n is authoritative.
- If final server validation produces a different price than the last confirmed display, stop before redirecting to Paystack and ask the customer to confirm the updated amount.

### Submission
- Disable the submit button during submission.
- Prevent duplicate submissions.
- Submit customer details and optional coupon code to the registration/payment endpoint.
- Do not send a client-calculated amount as an authoritative value. If a display amount is sent for consistency checking, the server must ignore it for pricing and independently calculate the amount.
- On success, redirect only to the Paystack authorization URL returned by the trusted endpoint.
- On failure, show a useful message and preserve safe form state for retry.
- Never display “Payment successful” at registration submission time.

## 4. Payment status page `/payment-status`
- Read the Paystack reference from the configured return mechanism.
- Treat the reference as an identifier, not proof of payment.
- Call the trusted status endpoint to obtain the authoritative state.
- Show clear loading, success, pending and failed states.
- If pending, allow a safe refresh/recheck.
- If failed, explain that payment has not been confirmed and provide a safe route back to registration or retry according to backend support.
- If successful, show a “View Ticket” action using the secure ticket access mechanism returned by the trusted backend.
- Do not expose raw API payloads, secret values or internal workflow details.
- Do not create a new payment merely because this page reloads.

## 5. Ticket page `/ticket`
- Require a secure ticket access token or equivalent backend-authorized access.
- Retrieve ticket data from the trusted backend.
- Display a ticket only when backend confirms payment and ticket issuance.
- Display only necessary information: event, date, venue, ticket holder name, ticket identifier and any approved entry instructions.
- Do not expose Mobile Money number or other unnecessary personal information.
- Do not generate a ticket locally from a payment reference.
- If access is invalid, expired or payment is not verified, show a safe unavailable state.
- Do not implement a public ticket verification page or public lookup form.

## 6. Visual and accessibility requirements
- Mobile-first responsive design.
- Clear hierarchy and strong primary CTA.
- Readable typography and sufficient color contrast.
- Keyboard-operable controls and visible focus states.
- Every input must have a persistent visible label; placeholders are not labels.
- Associate validation messages with their fields.
- Announce asynchronous status updates accessibly.
- Provide loading, disabled, success and error states.
- Avoid layout shifts when validation messages appear.
- Respect reduced-motion preferences.
- Do not use decorative animation that delays registration or checkout.

## 7. State management
Keep form state and coupon state explicit. Derive the displayed price from coupon validation state; do not maintain multiple conflicting price variables.

Recommended conceptual state:
- `fullName`
- `mobileMoneyNumber`
- `whatsAppNumber`
- `couponCode`
- `couponStatus`
- `couponValidationMessage`
- `confirmedDisplayPrice`
- `isSubmitting`

Do not store a trusted `isPaid` or authoritative ticket state in browser storage. Always retrieve these from the backend.
