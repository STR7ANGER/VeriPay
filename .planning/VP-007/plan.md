# VP-007 Plan

## Scope
- Replace the in-memory payment request repository with Supabase persistence.
- Keep a safe in-memory fallback when Supabase env vars are missing.
- Add a minimal Supabase migration for `payment_requests`.

## Approach
- Add a `payment_requests` table with `payment_request_id`, `record` (jsonb), `created_at`, `updated_at`.
- Update repository functions to use Supabase `upsert` + `select`.
- Make service methods async and update API routes accordingly.
- Extend `.env.example` with `SUPABASE_SERVICE_ROLE_KEY`.

## Acceptance Checks
- API flows still work end-to-end with in-memory fallback when Supabase env is absent.
- When Supabase env is present, `savePaymentRequest` persists and `getPaymentRequest` reads.

## Notes
- Supabase MCP is not available; only schema and client wiring are added.
