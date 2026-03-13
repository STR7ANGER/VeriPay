# API Design

Base path:

`/api`

## Endpoints

- `POST /api/payment-requests`
  - create request + extract `PaymentIntentDraft`
- `POST /api/payment-requests/:id/policy-evaluation`
  - run deterministic policy evaluation
- `POST /api/payment-requests/:id/permit`
  - mint a one-time `ExecutionPermit`
- `POST /api/payment-requests/:id/execute`
  - execute through Bankr or create a rehearsal receipt
- `GET /api/payment-requests/:id`
  - fetch the full lifecycle object

## Core Interfaces

- `PaymentIntentDraft`
- `PolicyVerdict`
- `ExecutionPermit`
- `ExecutionReceipt`
- `PaymentRequestRecord`

## Execution Guardrails

- reject blocked requests
- reject missing or expired permits
- reject chain mismatches between permit and execute call
- persist failures for auditability
