This is the `VeriPay Agent` application for the Synthesis hackathon.

## Scope

- Next.js app router
- Phase 0 foundations: wallet config, Base Sepolia, env handling, Gemini adapter
- Phase 1 feature: natural-language payment intent extraction through `POST /api/payment-requests`

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

## Key Routes

- `/`
- `/dashboard`
- `POST /api/payment-requests`

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- wagmi + viem
- Gemini API
- Supabase client scaffold

## Notes

- Gemini is used for extraction only.
- Transactions are not yet executed in this phase.
- Persistence and proof anchoring land in later phases.
