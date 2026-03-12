# Execution Plan

## Phase 0: Setup

### Goals

- initialize app
- set up Tailwind
- configure wallet connection
- configure Supabase
- configure Gemini API access

### Deliverables

- running Next.js app
- Base Sepolia chain config
- environment variable template
- DB connection working

## Phase 1: Core Request Pipeline

### Goals

- create payment request form
- call backend API
- extract structured intent with Gemini
- validate output with `zod`

### Deliverables

- prompt input screen
- parsed payment card
- backend intent extraction route

## Phase 2: Policy and Approval

### Goals

- implement deterministic policy engine
- show policy result in UI
- store request and evaluation
- record approval decision

### Deliverables

- policy result card
- approval/reject buttons
- audit timeline

## Phase 3: Execution and Proof

### Goals

- build transaction payload
- execute from wallet
- record tx hash and receipt
- create proof bundle hash

### Deliverables

- successful Base Sepolia payment
- explorer link
- proof hash display

## Phase 4: Demo and Submission Polish

### Goals

- tighten UI
- write README
- record demo
- prepare submission answers

### Deliverables

- clean landing/dashboard
- 2-minute demo recording
- final submission copy

## Suggested Day-by-Day Plan

### Day 1

- bootstrap project
- build wallet connect
- create payment input UI
- create AI extraction endpoint

### Day 2

- add DB schema
- build policy engine
- wire request detail page

### Day 3

- add approval flow
- add transaction sending
- add history list

### Day 4

- add proof generation
- improve audit timeline
- test edge cases

### Day 5

- polish UI
- write docs
- prepare screenshots
- rehearse demo

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| AI JSON output is inconsistent | High | Use strict schema validation and retries |
| Phantom EVM flow behaves differently on one browser | Medium | Keep wallet connector generic for injected EVM wallets |
| On-chain proof anchoring takes too long | Medium | Make DB hash proof the baseline and on-chain anchor optional |
| Supabase setup slows progress | Medium | Start with simple schema and minimal auth |
| UI polish slips due to backend work | High | Keep one clean dashboard page, not many screens |

## Immediate Next Build Step

Create the project skeleton first. Do not start with contracts.
