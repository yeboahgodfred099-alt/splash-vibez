# SPLASH & VIBEZ Ticketing Website

Frontend project instructions and implementation documentation.

## Start here
1. Read `AGENTS.md`.
2. Read all files in `docs/`.
3. Inspect the existing repository and preserve its working stack.
4. Implement the website according to the documented requirements.

## Website routes
- `/` — Event landing page.
- `/register` — Registration form and coupon validation.
- `/payment-status` — Authoritative payment status.
- `/ticket` — Protected ticket display.

There is no ticket verification page in this project scope.

## Registration form
Exactly four inputs:
- Full Name — required.
- Mobile Money Number — required.
- WhatsApp Number — required.
- Coupon Code — optional.

The first three fields must be valid before coupon validation is enabled. The two phone numbers are independent and must not be copied into each other.

## Ticket pricing
- Standard: GH₵120.
- Valid coupon: GH₵100.
- Discount: GH₵20.
- Coupon usage: unlimited.

The frontend displays the result of coupon validation, but n8n independently revalidates the code and calculates the final amount at registration/payment initialization.

## Integration setup
Copy `.env.example` to `.env` and replace placeholders with the actual public webhook URLs supplied by the project owner. Never put Paystack secret keys in frontend environment variables.

See `docs/N8N_INTEGRATION.md` for the proposed endpoint contracts and payment-security requirements.

## Development
If this is a new React + TypeScript + Vite project, the expected commands are typically:
```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Use only scripts that actually exist in `package.json`; add missing quality scripts when appropriate.

## Important
Do not use mock success responses in production. Do not treat a Paystack redirect as proof of payment. A ticket may only be displayed after the trusted backend confirms successful payment and ticket issuance.
