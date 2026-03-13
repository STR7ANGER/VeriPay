# Linear Backlog Seed

This file is the source draft for the Linear board until Linear MCP access is available.

## Workflow Contract

- Linear is the source of truth for issue state.
- `TASKS.md` is the local execution queue.
- Every Linear issue should map to one `.planning/<ISSUE>/` folder.
- Every implementation branch should include the issue key.
- UI tickets should include Chrome validation notes before PR.

## Ticket Batch

### Day 1

#### Ticket 1

- Title: `Persist VeriPay lifecycle state in Supabase`
- Suggested key: `UJJ-TBD-1`
- Assignee: `Codex`
- Priority: `Urgent`
- Depends on: `none`
- Acceptance criteria:
  - current in-memory lifecycle moves to Postgres
  - requests, verdicts, permits, receipts, and audit events are persisted
  - current dashboard behavior remains unchanged

#### Ticket 2

- Title: `Validate live Bankr execution on Base mainnet`
- Suggested key: `UJJ-TBD-2`
- Assignee: `Codex`
- Priority: `Urgent`
- Depends on: `UJJ-TBD-1`
- Acceptance criteria:
  - live Bankr submit path is tested with a tiny transfer
  - success and failure responses are captured in audit records
  - final demo path is documented

### Day 2

#### Ticket 3

- Title: `Tighten blocked and manual-review scenarios`
- Suggested key: `UJJ-TBD-3`
- Assignee: `Codex`
- Priority: `High`
- Depends on: `UJJ-TBD-1`, `UJJ-TBD-2`
- Acceptance criteria:
  - blocked overspend case is clear in the UI
  - unresolved ENS or social recipient case is clear in the UI
  - UI state is validated in browser before PR

#### Ticket 4

- Title: `Add MetaMask Delegations as an optional permit wrapper`
- Suggested key: `UJJ-TBD-4`
- Assignee: `Codex`
- Priority: `High`
- Depends on: `UJJ-TBD-3`
- Acceptance criteria:
  - delegation logic wraps the existing permit abstraction
  - current Bankr-first flow is not regressed
  - delegated authorization is optional, not a blocker

### Day 3

#### Ticket 5

- Title: `Submission polish and final README rewrite`
- Suggested key: `UJJ-TBD-5`
- Assignee: `Codex`
- Priority: `Medium`
- Depends on: `UJJ-TBD-4`
- Acceptance criteria:
  - README matches the shipped Bankr-first architecture
  - screenshots and demo path are aligned with the real product
  - partner-track language is consistent

#### Ticket 6

- Title: `Submission pack and demo asset finalization`
- Suggested key: `UJJ-TBD-6`
- Assignee: `Codex`
- Priority: `Medium`
- Depends on: `UJJ-TBD-5`
- Acceptance criteria:
  - README and demo script align with the shipped product
  - screenshots or video notes are ready
  - submission copy matches final implementation

## When Linear Access Exists

1. Create these tickets in Linear.
2. Replace `UJJ-TBD-*` with real issue keys in `TASKS.md`.
3. Create matching `.planning/<REAL-KEY>/` folders for active work.
4. Assign the active ticket to `Codex`.
