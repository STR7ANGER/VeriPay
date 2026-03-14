This is the `VeriPay Agent` application for the Synthesis hackathon.

## What It Does

VeriPay Agent turns natural-language payment instructions into policy-checked,
bounded execution permits and routes approved transfers through Bankr. Every
execution produces a proof hash and audit trail so agents can pay without giving
up human control.

## Getting Started

Create the environment file if needed:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
- `BANKR_API_KEY`
- `BANKR_BASE_URL`
- `VERIPAY_MAX_AMOUNT_ETH`
- `VERIPAY_ALLOWLIST`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If Supabase env vars are missing, the app falls back to an in-memory store.

## Demo Flow

1. Enter a natural-language payment request.
2. Review Gemini intent extraction.
3. Run policy evaluation.
4. Approve the bounded execution permit.
5. Execute with Bankr and capture the receipt.

## Rehearsal vs Live

- Base Sepolia is rehearsal mode and generates a proof hash without sending a live transaction.
- Live execution requires a supported mainnet chain and `BANKR_API_KEY`.

## Key Routes

- `/`
- `/dashboard`
- `POST /api/payment-requests`
- `POST /api/payment-requests/:id/policy-evaluation`
- `POST /api/payment-requests/:id/permit`
- `POST /api/payment-requests/:id/execute`
- `GET /api/payment-requests/:id`

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- wagmi + viem
- Gemini API
- Bankr Submit API
- Supabase Postgres (persistence)

## Notes

- Gemini is used for intent extraction only.
- Bankr is the load-bearing execution layer.
