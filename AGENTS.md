# Project Workflow

## Daily Flow

1. Read `MEMORY.md`.
2. Open `TASKS.md` and pick the first unblocked issue.
3. Use `.planning/<ISSUE>/plan.md`.
4. Implement on the issue-linked branch.
5. Run checks before commit.
6. Record validation notes in `.planning/<ISSUE>/feedback.md`.
7. Commit with the issue key in the message.
8. Push and update issue status.

## Planning Convention

- Active pattern:
  - `.planning/<ISSUE>/plan.md`
  - `.planning/<ISSUE>/feedback.md`
- Do not use legacy `.plan/...` patterns for new work.

## Validation

- `npm run lint`
- `npm run format:check` when available
- issue-relevant tests when available
- real browser validation for UI work when environment supports it

## Branch and Commit Rules

- one primary issue per branch
- branch names include issue keys
- commit messages include issue keys

## Current Limitation

Linear MCP is not available in this environment, so local issue docs and `TASKS.md` are the execution view for now.
