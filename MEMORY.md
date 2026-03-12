# MEMORY

## Current Goal

Bootstrap `VeriPay Agent` and deliver Phase 0 plus Phase 1.

## Current Constraints

- zero-budget stack
- wallet preference is `Phantom`
- backend should stay simple and colocated with the app
- only Base Sepolia is needed for MVP
- AI must be advisory only
- user asked for workflow files, issue tracking, commits, and push

## Stack Decisions

- app directory: `veripay-agent`
- framework: `Next.js`
- chain: `Base Sepolia`
- wallet: injected EVM wallet with Phantom-first UX
- AI provider: `Gemini`
- DB for later phases: `Supabase Postgres`

## Known Risks

- Linear MCP is not available in this environment
- GitHub push and package installation require network access
- Phantom should be treated as a generic injected EVM wallet to reduce connector risk

## Progress

- workflow harness files created
- planning set created
- Next.js app scaffolded in `veripay-agent/`
- wallet connect and Base Sepolia config implemented
- Gemini extraction route implemented
- formatting, lint, and production build passed

## Immediate Next Steps

1. Commit the work in issue-aligned commits.
2. Rename the branch to `main`.
3. Add the GitHub remote.
4. Push to the target repository.
