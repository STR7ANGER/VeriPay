# Low-Level Design

## Service Breakdown

## 1. Intent Extraction Service

Responsibilities:

- call Gemini
- normalize into `PaymentIntentDraft`
- fail closed on invalid extraction

## 2. Policy Engine Service

Responsibilities:

- classify recipient format
- enforce amount cap
- apply allowlist if configured
- return `PolicyVerdict`

## 3. Permit Service

Responsibilities:

- mint a time-bounded `ExecutionPermit`
- enforce explicit recipient resolution
- bind chain target, amount ceiling, and recipient

## 4. Bankr Execution Adapter

Responsibilities:

- submit approved transfers through Bankr
- capture response fields and failure details
- support rehearsal mode separately from live execution

## 5. Proof Service

Responsibilities:

- hash the full lifecycle bundle
- produce stable proof hashes

## 6. Payment Request Service

Responsibilities:

- orchestrate the lifecycle
- append audit events
- read and write the current request record

## 7. Repository Layer

Current implementation:

- in-memory store

Next implementation:

- Supabase-backed persistence for all lifecycle entities
