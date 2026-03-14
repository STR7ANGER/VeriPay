# MEMORY

## Current Goal

Ship the Bankr-first delegated-guardrails version of `VeriPay Agent`.

## Current Constraints

- zero-budget stack
- UI component system is now `shadcn/ui`
- backend should stay simple and colocated with the app
- Bankr is the load-bearing execution layer
- Base Sepolia is rehearsal mode, not the final live path
- AI must be advisory only
- user asked for workflow files, issue tracking, commits, and push
- user wants Linear-first execution once Linear access is available

## Stack Decisions

- app directory: `veripay-agent`
- framework: `Next.js`
- execution partner: `Bankr`
- rehearsal chain: `Base Sepolia`
- live demo target: `Base Mainnet`
- AI provider: `Gemini`
- persistence next: `Supabase Postgres`

## Known Risks

- Linear MCP is not available in this environment
- GitHub push and package installation require network access
- Phantom should be treated as a generic injected EVM wallet to reduce connector risk

## Progress

- workflow harness files created
- planning set created
- Next.js app scaffolded in `veripay-agent/`
- `shadcn/ui` base setup added
- Bankr-first lifecycle implemented in-memory
- policy verdict, execution permit, execution receipt, proof hash, and audit trail added
- formatting, lint, and production build passed on the Bankr flow

## Immediate Next Steps

1. Validate a real Bankr-backed live transfer with a small value.
