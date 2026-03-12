# VP-003 Plan

## Scope

Implement the Gemini extraction adapter and the first payment-intent API route.

## Deliverables

- request/response schemas
- Gemini provider
- payment request service
- `POST /api/payment-requests`

## Acceptance Checks

- invalid requests are rejected
- valid requests return a typed intent draft
- build and lint pass
