# Project Workflow

## Daily Flow

1. Read `MEMORY.md`.
2. Open `TASKS.md` and pick the first unblocked issue.
3. Verify the issue status, assignee, and dependencies in Linear.
4. Use `.planning/<ISSUE>/plan.md`.
5. Implement on the issue-linked branch.
6. Run checks before commit.
7. Reproduce and validate UI changes in Chrome DevTools MCP when available.
8. Record validation notes in `.planning/<ISSUE>/feedback.md`.
9. Commit with the issue key in the message.
10. Push, update Linear, and refresh `TASKS.md`.

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

Linear MCP and Chrome DevTools MCP are not available in this environment, so local issue docs and `TASKS.md` are the execution view for now. When those tools are available again, they take precedence for issue state and browser validation.
