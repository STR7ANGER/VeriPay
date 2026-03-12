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

- Title: `Policy engine for payment intent evaluation`
- Suggested key: `UJJ-TBD-1`
- Assignee: `Codex`
- Priority: `Urgent`
- Depends on: `none`
- Acceptance criteria:
  - deterministic policy service exists
  - max amount and recipient allowlist rules are supported
  - verdict returns `approved`, `manual_review`, or `blocked`
  - tests cover core rule paths

#### Ticket 2

- Title: `Persist payment requests and audit events in Supabase`
- Suggested key: `UJJ-TBD-2`
- Assignee: `Codex`
- Priority: `Urgent`
- Depends on: `UJJ-TBD-1`
- Acceptance criteria:
  - schema created for requests, intents, policy results, and audit logs
  - repository layer is introduced
  - request creation path writes persistent records

### Day 2

#### Ticket 3

- Title: `Approval workflow UI with policy result panel`
- Suggested key: `UJJ-TBD-3`
- Assignee: `Codex`
- Priority: `High`
- Depends on: `UJJ-TBD-1`, `UJJ-TBD-2`
- Acceptance criteria:
  - user can review verdict and reasons
  - user can approve or reject a payment request
  - UI state is validated in browser before PR

#### Ticket 4

- Title: `Generate transaction payload and execute Base Sepolia payment`
- Suggested key: `UJJ-TBD-4`
- Assignee: `Codex`
- Priority: `High`
- Depends on: `UJJ-TBD-3`
- Acceptance criteria:
  - approved request can produce a wallet transaction payload
  - Phantom-compatible signing path works
  - tx hash is recorded and surfaced in UI

### Day 3

#### Ticket 5

- Title: `Create proof bundle hash and execution history timeline`
- Suggested key: `UJJ-TBD-5`
- Assignee: `Codex`
- Priority: `Medium`
- Depends on: `UJJ-TBD-4`
- Acceptance criteria:
  - execution receipt bundle is canonicalized and hashed
  - history timeline shows all major lifecycle steps
  - proof data is queryable from the UI

#### Ticket 6

- Title: `Hackathon polish and submission pack`
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
