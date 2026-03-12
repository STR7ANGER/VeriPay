# Planning Index

Project codename: `VeriPay Agent`

This folder contains the full build plan for the hackathon project:

- `01-product-brief.md`: problem statement, scope, and winning angle
- `02-tech-stack.md`: stack decisions, cost constraints, and tooling choices
- `03-requirements.md`: functional and non-functional requirements
- `04-hld.md`: high-level design and architecture
- `05-data-model.md`: entities, table design, and relationships
- `06-api-design.md`: backend API contract
- `07-lld-services.md`: low-level service design and module responsibilities
- `08-repo-structure.md`: recommended codebase layout
- `09-feature-checklist.md`: MVP and stretch scope
- `10-execution-plan.md`: delivery phases and day-by-day plan
- `11-demo-script.md`: 2-minute demo script
- `12-judging-narrative.md`: pitch, submission copy, and judge-facing framing

Recommended build target:

- Wallet: `Phantom` on Base Sepolia via injected EVM provider
- AI model: `Gemini 2.0 Flash` or latest free Gemini Developer API model available in Google AI Studio
- Backend: `Next.js` API routes + `Postgres` via `Supabase`
- Chain: `Base Sepolia`

Primary product statement:

`A verifiable payment execution layer for AI agents that turns natural-language payment requests into policy-checked, human-approved, and provably logged transactions.`
