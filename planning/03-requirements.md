# Requirements

## Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-1 | User can connect an EVM wallet, preferably Phantom on Base Sepolia. | Must |
| FR-2 | User can submit a natural-language payment request. | Must |
| FR-3 | AI service converts the prompt into structured payment intent JSON. | Must |
| FR-4 | System validates amount, token, recipient, and reason fields. | Must |
| FR-5 | Policy engine evaluates the intent against configured rules. | Must |
| FR-6 | UI shows approval status, risk flags, and explanation before payment. | Must |
| FR-7 | User can explicitly approve or reject a payment request. | Must |
| FR-8 | Approved requests can be executed from the connected wallet. | Must |
| FR-9 | System stores a tamper-evident audit record of each payment lifecycle stage. | Must |
| FR-10 | User can view payment history and proof data. | Must |
| FR-11 | System can hash the final receipt and anchor or attest it on-chain. | Should |
| FR-12 | System supports policy templates such as amount limit and allowlist. | Should |
| FR-13 | System can simulate or preview the transaction before execution. | Should |
| FR-14 | User can export an audit bundle for a payment. | Could |

## Non-Functional Requirements

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-1 | Demo flow must complete in under 2 minutes. | High |
| NFR-2 | AI response for intent extraction should return in under 5 seconds for demo prompts. | High |
| NFR-3 | The system must fail closed if AI output is invalid or incomplete. | High |
| NFR-4 | No transaction may execute without explicit user confirmation. | Critical |
| NFR-5 | All state transitions must be logged with timestamps. | Critical |
| NFR-6 | Architecture should allow model replacement without major refactor. | Medium |
| NFR-7 | UI must be understandable to non-technical judges. | High |
| NFR-8 | Sensitive secrets must stay server-side and never be exposed in the client. | Critical |
| NFR-9 | The app must be deployable on free-tier infrastructure. | High |
| NFR-10 | Core flows should degrade gracefully if on-chain proof anchoring is unavailable. | Medium |

## Assumptions

- users connect their own wallet for signing
- only Base Sepolia is supported in MVP
- only native ETH transfers are required for MVP
- recipient addresses are either typed directly or selected from a saved list
- single-user mode is enough for hackathon demo

## Out Of Scope

- multi-sig orchestration
- recurring subscription payments
- cross-chain routing
- stablecoin swaps
- fiat on-ramp
- production-grade AML/KYC systems
- autonomous agent execution without user approval
