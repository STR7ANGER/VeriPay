# Low-Level Design

## Service Breakdown

## 1. Intent Extraction Service

File target:

`src/server/services/intent-extraction.service.ts`

Responsibilities:

- build Gemini prompt
- request structured JSON output
- parse and validate with `zod`
- normalize to internal DTO

Input:

- `rawPrompt`
- `walletAddress`
- optional known recipients

Output:

- `PaymentIntentDraft`

Interface:

```ts
type PaymentIntentDraft = {
  recipientAddress: `0x${string}`;
  recipientLabel?: string;
  amountWei: string;
  tokenSymbol: "ETH";
  reason: string;
  confidenceScore: number;
  explanation: string;
  rawModelOutput: unknown;
};
```

Rules:

- no valid JSON, no progress
- missing required fields means hard failure

## 2. Policy Engine Service

File target:

`src/server/services/policy-engine.service.ts`

Responsibilities:

- evaluate rules in deterministic order
- produce verdict and reasons
- keep logic fully independent from AI provider

Core methods:

- `evaluate(intent, rules)`
- `scoreRisk(intent, ruleResults)`

Verdict semantics:

- `approved`: passes all active constraints and does not require manual review
- `manual_review`: human can still approve
- `blocked`: execution should not proceed

## 3. Payment Request Service

File target:

`src/server/services/payment-request.service.ts`

Responsibilities:

- create request
- orchestrate extraction + policy evaluation
- persist records
- emit audit events

Key methods:

- `createPaymentRequest(input)`
- `getPaymentRequest(id)`
- `listPaymentRequests(filters)`

## 4. Approval Service

File target:

`src/server/services/approval.service.ts`

Responsibilities:

- record approval or rejection
- enforce allowed status transitions
- append audit logs

## 5. Transaction Service

File target:

`src/server/services/transaction.service.ts`

Responsibilities:

- construct payable transaction payload
- verify request has approved status
- record tx hash
- fetch transaction receipt
- update final execution state

Methods:

- `buildTransactionPayload(paymentRequestId)`
- `recordSubmittedTransaction(paymentRequestId, txHash)`
- `finalizeTransaction(paymentRequestId, txHash)`

## 6. Proof Service

File target:

`src/server/services/proof.service.ts`

Responsibilities:

- build canonical receipt bundle JSON
- compute deterministic hash
- optionally anchor hash on-chain
- store proof record

Bundle contents:

- raw prompt
- parsed intent
- policy verdict
- approval decision
- tx hash
- chain receipt

## 7. Audit Log Service

File target:

`src/server/services/audit-log.service.ts`

Responsibilities:

- append audit records for every key state transition
- keep event schema consistent

Event types:

- `payment_request_created`
- `intent_extracted`
- `policy_evaluated`
- `payment_approved`
- `payment_rejected`
- `transaction_submitted`
- `transaction_confirmed`
- `proof_created`

## 8. Wallet Client Module

Client file target:

`src/lib/wallet.ts`

Responsibilities:

- connect injected EVM wallet
- switch to Base Sepolia
- send ETH transaction

## 9. AI Provider Adapter

File target:

`src/server/providers/ai-provider.ts`

Goal:

Abstract provider-specific SDK details so the rest of the app depends on a stable interface.

Interface:

```ts
export interface AiProvider {
  extractPaymentIntent(input: {
    rawPrompt: string;
    walletAddress?: string;
  }): Promise<unknown>;
}
```

Implementation:

- `gemini.provider.ts`

## LLD Notes

- keep domain DTOs in `src/server/domain`
- use `zod` schemas at all API boundaries
- keep transaction broadcasting in frontend, not backend
- keep AI service stateless
