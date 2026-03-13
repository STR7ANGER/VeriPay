This is the `VeriPay Agent` application for the Synthesis hackathon.

## Scope

- Next.js app router
- Gemini-powered intent extraction
- deterministic policy evaluation and recipient resolution state
- bounded execution permits
- Bankr-backed execution path with rehearsal and proof modes

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
- Supabase client scaffold

## Notes

- Gemini is used for intent extraction only.
- Base Sepolia is rehearsal mode.
- Live Bankr execution requires `BANKR_API_KEY` and a supported live chain.
- Supabase persistence is still a follow-up phase.
