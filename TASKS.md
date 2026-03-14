# TASKS

## Queue

| Issue | Title | Priority | Status | Blocked By | Notes |
| --- | --- | --- | --- | --- | --- |
| VP-001 | Bootstrap Next.js app and project workflow harness | P0 | Done | None | Root setup, issue docs, base app scaffold |
| VP-002 | Implement wallet connect and Base Sepolia configuration | P0 | Done | VP-001 | Injected EVM wallet with Phantom-first UX |
| VP-003 | Implement Gemini intent extraction adapter and `/api/payment-requests` route | P0 | Done | VP-001 | Strict schema validation |
| VP-004 | Build payment request UI and parsed intent result card | P0 | Done | VP-002, VP-003 | Phase 1 UI |
| VP-005 | Add lint, environment docs, and GitHub push workflow | P1 | Done | VP-001 | Finalize bootstrap and publish |
| VP-012 | Add shadcn/ui baseline and reinforce Linear workflow docs | P1 | Done | VP-005 | Real Linear access still pending |
| VP-013 | Implement Bankr-first delegated guardrails flow | P0 | Done | VP-003, VP-012 | Policy, permit, execution, proof |
| VP-006 | Add deterministic policy engine and approval verdict model | P0 | Done | VP-003 | Landed inside VP-013 |
| VP-007 | Persist requests, intents, and audit events in Supabase | P0 | Done | VP-013 | Supabase repo + migration + fallback |
| VP-008 | Build approval UI and policy result panel | P0 | Done | VP-006, VP-007 | Landed with in-memory lifecycle |
| VP-009 | Generate Bankr execution path for approved transfers | P0 | Done | VP-008 | Rehearsal + live Bankr route |
| VP-010 | Create proof bundle hash and execution history timeline | P1 | Done | VP-009 | Proof hash and audit timeline shipped |
| VP-011 | Record demo, polish README, and finalize submission assets | P1 | Todo | VP-010 | Final hackathon packaging |

## Working Rules

- Work from the first unblocked issue.
- Keep one primary issue per branch.
- Use `.planning/<ISSUE>/plan.md` and `.planning/<ISSUE>/feedback.md`.
- Update this file when issue states change.
- Mirror Linear issue keys here once Linear tickets are created.
