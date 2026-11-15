# SPLASH & VIBEZ — Design Guidelines

## 1. Design objective
Create a premium, energetic and clear event-ticketing experience. The visual direction should communicate a lively poolside night event while keeping the purchase journey simple and trustworthy.

## 2. Visual direction
- Use a strong event-led hero section with approved event imagery.
- Use a clear typographic hierarchy and high-contrast calls to action.
- Use a dark/night-event visual foundation with vibrant accent colors only if it supports legibility.
- Use restrained gradients, glow or motion; avoid excessive effects that reduce readability.
- Keep registration and payment screens especially clean and focused.
- Use consistent spacing, border radius, button styles and form-field dimensions.
- Do not copy another designer's exact layout or assets. Treat the supplied booking UI reference as general inspiration only.

## 3. Content hierarchy
Landing page:
1. SPLASH & VIBEZ.
2. Date and venue.
3. Short event description based only on approved event details.
4. Ticket price information.
5. Primary “Get Your Ticket” CTA.

Registration page:
1. Clear page title and brief instruction.
2. Three required customer fields.
3. Optional coupon field and Validate action, initially locked until required fields are valid.
4. Price summary.
5. Payment/registration submit action.
6. Short reassurance explaining that payment is processed securely through Paystack.

Payment status page:
1. Current status.
2. Plain-language explanation.
3. Next action based on verified status.

Ticket page:
1. SPLASH & VIBEZ identity.
2. Ticket holder and event information.
3. Ticket identifier.
4. Any approved entry instructions.

## 4. Form interaction design
- Labels must remain visible.
- Required fields must be clearly marked.
- Coupon section should visibly communicate that the first three fields must be completed before coupon validation.
- Disabled controls must look disabled and be programmatically disabled.
- Show coupon loading feedback during validation.
- Show distinct success, invalid-code and technical-error feedback.
- When a code changes, clear the previous success state immediately.
- Do not use color alone to communicate validation state; include text and/or icons with accessible labels.

## 5. Responsive behavior
- Design for narrow mobile screens first.
- Keep form controls full-width on mobile.
- Avoid horizontal scrolling.
- Make buttons comfortably tappable.
- Keep the price summary and primary CTA easy to find.
- On desktop, use a balanced content width rather than stretching form fields across the entire screen.

## 6. Motion and performance
- Use subtle transitions only.
- Respect `prefers-reduced-motion`.
- Optimize and appropriately size images.
- Lazy-load non-critical images.
- Do not allow video or animation to delay access to the registration form.

## 7. Content accuracy
Use only confirmed event information. Do not invent:
- Exact street address.
- Contact numbers.
- Refund/cancellation policy.
- Entry restrictions.
- Extra ticket benefits.
- Remaining ticket count or urgency claims.
- Coupon terms beyond unlimited use and the GH₵20 discount.

If additional content is needed, add a clearly marked configuration placeholder and request confirmation from the project owner.
