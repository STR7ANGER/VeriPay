# TASKS

## Queue

| Issue | Title | Priority | Status | Blocked By | Notes |
| --- | --- | --- | --- | --- | --- |
| VP-001 | Bootstrap Next.js app and project workflow harness | P0 | Done | None | Root setup, issue docs, base app scaffold |
| VP-002 | Implement wallet connect and Base Sepolia configuration | P0 | Done | VP-001 | Injected EVM wallet with Phantom-first UX |
| VP-003 | Implement Gemini intent extraction adapter and `/api/payment-requests` route | P0 | Done | VP-001 | Strict schema validation |
| VP-004 | Build payment request UI and parsed intent result card | P0 | Done | VP-002, VP-003 | Phase 1 UI |
| VP-005 | Add lint, environment docs, and GitHub push workflow | P1 | In Progress | VP-001 | Finalize bootstrap and publish |

## Working Rules

- Work from the first unblocked issue.
- Keep one primary issue per branch.
- Use `.planning/<ISSUE>/plan.md` and `.planning/<ISSUE>/feedback.md`.
- Update this file when issue states change.
