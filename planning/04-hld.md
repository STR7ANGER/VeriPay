# High-Level Design

## System Goal

Transform natural-language payment instructions into safe and verifiable wallet actions.

## Architecture Overview

```mermaid
flowchart TD
    U["User"] --> FE["Next.js Frontend"]
    FE --> WAL["Injected Wallet (Phantom / EVM)"]
    FE --> API["Backend API"]
    API --> AIS["AI Intent Service (Gemini)"]
    API --> POL["Policy Engine"]
    API --> DB["Postgres / Supabase"]
    API --> CHAIN["Base Sepolia"]
    API --> PROOF["Proof Anchoring / Attestation"]
    WAL --> CHAIN
```

## Main Components

### 1. Frontend

Responsibilities:

- wallet connection
- natural-language request input
- display structured intent
- show policy results and risks
- allow user approval
- show execution status and proof trail

### 2. Backend API

Responsibilities:

- receive payment requests
- call AI service to extract intent
- validate intent schema
- evaluate policies
- store lifecycle records
- return transaction payload for execution
- persist execution and proof metadata

### 3. AI Intent Service

Responsibilities:

- turn prompt into strict JSON
- produce explanation text
- produce confidence/risk hints

Critical constraint:

- AI output is advisory, not authoritative

### 4. Policy Engine

Responsibilities:

- check transaction amount thresholds
- validate recipient allowlist or blocklist
- enforce manual approval rules
- generate policy verdict and reasons

### 5. Audit Store

Responsibilities:

- store request, intent, verdict, approval, execution, and proof records
- maintain immutable-looking lifecycle history

### 6. On-Chain Layer

Responsibilities:

- execute final payment from user wallet
- optionally anchor proof hash or attestation

## Core Workflow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant AI
    participant Policy
    participant Wallet
    participant Chain
    participant DB

    User->>UI: Enter payment request
    UI->>API: Create payment request
    API->>AI: Extract structured intent
    AI-->>API: Payment intent JSON
    API->>Policy: Evaluate intent
    Policy-->>API: Verdict + reasons
    API->>DB: Save request + intent + verdict
    API-->>UI: Show policy decision
    User->>UI: Approve payment
    UI->>Wallet: Sign and send transaction
    Wallet->>Chain: Broadcast tx
    UI->>API: Submit tx hash/result
    API->>DB: Save execution receipt
    API->>Chain: Optional proof anchor
    API->>DB: Save proof record
    API-->>UI: Final verified state
```

## HLD Decisions

### Why Frontend-Signed Transactions

This is safer and simpler than backend-held private keys. It also gives a judge a visible approval step.

### Why AI Runs Server-Side

- keeps API keys private
- simplifies prompt control
- lets us enforce schema validation before UI sees the result

### Why Proof Storage Has Two Layers

- database for full readable records
- blockchain for immutable anchor / proof reference

This balances usability and verifiability.
