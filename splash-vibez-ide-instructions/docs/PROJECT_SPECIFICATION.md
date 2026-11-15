# SPLASH & VIBEZ — Project Specification

## 1. Project overview
Create a responsive ticketing website for the SPLASH & VIBEZ event. The site introduces the event, collects the minimum customer information, validates an optional discount coupon, starts payment through Paystack via n8n, displays payment status and provides access to a paid ticket.

The frontend must not own business-critical decisions. n8n and its database are authoritative for coupon validity, final price, payment initialization, payment verification and ticket issuance.

## 2. Confirmed event information
Use these details where relevant:
- Event name: SPLASH & VIBEZ
- Venue: Triple Hill Hotel
- Date: Saturday, 12 December 2026
- Event time: 8:00 PM to 3:00 AM
- Standard ticket price for this website: GH₵120
- Valid-coupon ticket price: GH₵100
- Discount: GH₵20

Important: Earlier event promotion materials may contain other ticket prices. For this ticketing website, the pricing in this specification is authoritative: GH₵120 standard and GH₵100 with a valid coupon. Do not mix the earlier promotional prices into checkout.

Do not invent an event address, phone number, refund policy, age restriction, capacity, ticket category or additional inclusions. If needed, make these configurable and leave clearly marked placeholders pending confirmation.

## 3. Scope
### Included
- Event landing page.
- Registration page.
- Four form inputs: Full Name, Mobile Money Number, WhatsApp Number and optional Coupon Code.
- Coupon validation action.
- Registration submission to n8n.
- Paystack checkout redirect.
- Payment status page.
- Ticket page accessible only after verified payment.
- Ticket delivery trigger through the n8n WhatsApp workflow.

### Excluded
- Ticket verification page.
- Customer email collection.
- Ticket-type selection.
- Quantity selection, unless separately approved.
- Account creation and customer login.
- Public ticket lookup by name or phone number.
- Frontend-side payment verification.
- Coupon redemption limits or usage counters.

## 4. Customer form
Required inputs:
1. Full Name — required text.
2. Mobile Money Number — required phone input. Used as the payment/customer contact number as defined by the payment workflow.
3. WhatsApp Number — required phone input. Used for ticket delivery.
4. Coupon Code — optional text input.

The two phone numbers must be separately entered and independently stored. Do not assume they are identical.

Use Ghana as the initial phone-number context. Accept common Ghanaian formats such as local `0XXXXXXXXX` and international `+233XXXXXXXXX`, then normalize consistently before sending to n8n. Do not silently change the number's meaning. If the application is intended to support other countries later, make country selection an explicit future requirement rather than guessing.

## 5. Coupon and pricing rules
| Condition | Customer price |
|---|---:|
| Coupon omitted | GH₵120 |
| Coupon submitted and valid | GH₵100 |
| Coupon submitted and invalid | GH₵120 |
| Coupon validation service unavailable | Price is not confirmed as discounted; show a technical error and allow retry or continue without coupon at GH₵120 |

Coupon rules:
- Coupon codes are case-normalized according to the backend's documented policy. The frontend may trim whitespace but must not invent code semantics.
- Coupons have unlimited usage.
- Multiple customers may use the same valid code.
- No single-use restriction, maximum-use count, redemption counter, reservation, locking or decrement logic.
- The validation endpoint checks whether the code is valid and returns the applicable display price.
- Final registration must revalidate the code independently. The final amount returned by the trusted workflow is authoritative.
- If a coupon becomes invalid between validation and final submission, charge the standard price or return a clear response requiring the customer to confirm the updated price. Do not silently charge a different amount from the price shown immediately before checkout.

## 6. Customer journey
1. Customer opens `/`.
2. Customer reviews event information and selects the registration call to action.
3. Customer opens `/register`.
4. Customer enters Full Name, Mobile Money Number and WhatsApp Number.
5. Once all three required fields are valid, the coupon input and Validate action become available.
6. Customer may leave the coupon empty or enter a code and validate it.
7. The page displays GH₵120 by default. It displays GH₵100 only after the server confirms the coupon is valid.
8. Customer submits registration.
9. Frontend sends the customer details and coupon code, if supplied, to the n8n registration/payment-initialization endpoint.
10. n8n validates the fields, rechecks the coupon, calculates the amount and initializes a Paystack transaction.
11. Frontend redirects the customer to the authorization URL returned by n8n.
12. Paystack returns the customer to `/payment-status` with the relevant reference.
13. The status page asks the trusted workflow for the verified transaction state.
14. If payment is verified successful, the customer can open the ticket page. The workflow also triggers WhatsApp ticket delivery.
15. If payment is pending or failed, show the appropriate status and safe next step. Do not display a valid ticket.

## 7. Pages and routes
- `/` — Landing page.
- `/register` — Registration and coupon validation.
- `/payment-status` — Payment result/status.
- `/ticket` — Protected ticket display.

No `/verify-ticket` route or public ticket verification feature should be created.

## 8. Acceptance criteria
The project is acceptable when:
- Exactly four inputs appear on the registration form.
- The first three fields are required; coupon is optional.
- Coupon validation cannot be triggered until all first three fields pass validation.
- A blank coupon allows standard-price registration.
- A valid coupon displays GH₵100.
- An invalid coupon displays an error and leaves the price at GH₵120.
- A technical validation error is not misrepresented as an invalid code.
- The same coupon can be used by multiple customers.
- The final registration endpoint independently validates the coupon and calculates the amount.
- The browser cannot force a discounted amount by editing frontend state or a request field.
- Paystack initialization occurs through n8n, not directly with a secret key in the browser.
- A return URL alone cannot mark a payment successful.
- Only verified successful payments result in ticket issuance/access.
- Ticket access is not based on guessable information.
- The ticket is sent to the submitted WhatsApp number after verified payment.
- No ticket verification page exists.
