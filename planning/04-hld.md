# High-Level Design

## System Goal

Transform natural-language payment requests into bounded, Bankr-executed transfers with a verifiable audit trail.

## Architecture Overview

```mermaid
flowchart TD
    U["User"] --> FE["Next.js Frontend"]
    FE --> API["Backend API"]
    API --> AI["Gemini Intent Extraction"]
    API --> POL["Policy Engine"]
    API --> PERMIT["Execution Permit Service"]
    API --> BANKR["Bankr Execution Adapter"]
    API --> PROOF["Proof Hash + Audit Trail"]
    API --> DB["Supabase / Repo Store"]
    BANKR --> CHAIN["Live Chain / Base"]
```

## Main Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant AI
    participant Policy
    participant Permit
    participant Bankr

    User->>UI: Enter payment prompt
    UI->>API: Create request
    API->>AI: Extract transfer intent
    UI->>API: Evaluate policy
    API->>Policy: Evaluate rules
    User->>UI: Approve bounded execution
    UI->>API: Mint permit
    UI->>API: Execute
    API->>Bankr: Submit approved transfer
    Bankr-->>API: Tx result
    API-->>UI: Receipt + proof + audit trail
```
