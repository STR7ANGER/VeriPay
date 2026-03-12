# Tech Stack Decisions

## Constraints

- Budget: effectively `0 INR`
- Goal: ship a working hackathon demo fast
- Requirement: open source and demoable
- Risk: avoid infra that needs paid subscriptions

## AI Model Choice

### Recommended

`Gemini` via Google AI Studio / Gemini Developer API

Reason:

- free tier is the most realistic zero-cost option
- good enough for intent extraction and explanation generation
- structured JSON generation is sufficient for this MVP
- easy to swap later because our backend will wrap the model behind one service interface

### Fallback Model Strategy

- Primary: `Gemini 2.0 Flash` or latest free fast Gemini model
- Secondary: any free Hugging Face inference model for local/dev fallback
- Optional paid switch later: `gpt-4o-mini` or similar if credits appear

### Why Not Depend on GPT First

- OpenAI API is usually not the safest assumption for zero-budget building
- this project needs reliable structured extraction more than frontier reasoning
- cost control matters more than model prestige for hackathon MVP

## Wallet Choice

### Recommended

`Phantom`, using its injected EVM wallet support on Base Sepolia

Reason:

- you already prefer Phantom
- Base Sepolia keeps gas and risk low
- browser-wallet demo is easy for judges to follow

### Practical Note

Many EVM apps are implemented using generic injected-wallet flows. We should support:

- `window.ethereum` / injected EVM wallet
- label UI as `Connect Phantom`
- keep the connector generic enough that MetaMask or Coinbase Wallet could also work if needed

This reduces integration risk.

## Frontend

- `Next.js 15`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui` only if it speeds up delivery
- `wagmi` + `viem` for wallet and chain integration

Why:

- fast iteration
- good DX
- easy API colocation
- strong ecosystem for wallet apps

## Backend

### Recommended

`Next.js API routes` as the backend for MVP

Reason:

- one repo
- lower deployment complexity
- enough for CRUD, AI inference orchestration, policy evaluation, and audit logging

### Database

`Supabase Postgres`

Reason:

- generous free tier
- hosted Postgres without ops burden
- easy auth and storage if needed later

### Object Storage

Optional:

- `Supabase Storage` for exported audit reports or screenshots

## Blockchain

- chain: `Base Sepolia`
- transaction client: `viem`
- optional proof anchoring: simple hash anchoring contract or public attestation path

## Deployment

- frontend/backend: `Vercel` free tier
- database: `Supabase` free tier

## Security Posture For MVP

- never let the AI directly broadcast transactions
- AI can only produce a `PaymentIntentDraft`
- backend policy engine decides eligibility
- frontend requires explicit human wallet signature for final execution

## Final Recommendation

Use:

- `Next.js`
- `TypeScript`
- `Tailwind`
- `wagmi`
- `viem`
- `Supabase`
- `Gemini`
- `Phantom`
- `Base Sepolia`

This is the best speed-to-demo stack for your constraints.
