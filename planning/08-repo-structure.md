# Repo Structure

## Recommended Layout

```text
.
├── planning/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payment-requests/
│   │   │   ├── policy-rules/
│   │   │   └── health/
│   │   ├── dashboard/
│   │   ├── payments/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── payments/
│   │   ├── proofs/
│   │   ├── policies/
│   │   └── ui/
│   ├── lib/
│   │   ├── env.ts
│   │   ├── wallet.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── server/
│   │   ├── domain/
│   │   ├── providers/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── validators/
│   └── styles/
├── supabase/
│   └── migrations/
├── docs/
├── .env.example
├── package.json
└── README.md
```

## Directory Purpose

### `src/app`

- app routes
- dashboard pages
- API route handlers

### `src/components`

- reusable UI pieces
- payment flow cards
- audit and proof widgets

### `src/server/services`

- core business logic
- no UI code
- no provider-specific leakage

### `src/server/repositories`

- DB reads/writes
- query isolation

### `src/server/providers`

- Gemini adapter
- optional future providers

### `supabase/migrations`

- schema evolution
- reproducible DB setup

## Key Files To Create Early

- `.env.example`
- `src/lib/env.ts`
- `src/lib/wallet.ts`
- `src/server/providers/gemini.provider.ts`
- `src/server/services/payment-request.service.ts`
- `src/server/services/policy-engine.service.ts`
- `src/server/services/proof.service.ts`
- `src/app/dashboard/page.tsx`
- `src/app/api/payment-requests/route.ts`
