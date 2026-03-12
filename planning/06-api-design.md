# API Design

## API Style

- REST over JSON
- server-generated IDs
- schema validation with `zod`
- all write endpoints append audit log events

Base path:

`/api`

## Authentication

For hackathon MVP:

- wallet-based session or lightweight anonymous demo mode
- authenticated identity can be added later

## Endpoints

### 1. Create Payment Request

`POST /api/payment-requests`

Request:

```json
{
  "walletAddress": "0xabc...",
  "rawPrompt": "Pay 0.01 ETH to 0xdef... for design work"
}
```

Response:

```json
{
  "paymentRequestId": "uuid",
  "status": "pending_approval",
  "intent": {
    "recipientAddress": "0xdef...",
    "amountEth": "0.01",
    "tokenSymbol": "ETH",
    "reason": "design work",
    "confidenceScore": 0.92,
    "explanation": "The request asks to send 0.01 ETH to 0xdef for design work."
  },
  "policy": {
    "verdict": "manual_review",
    "riskScore": 18,
    "reasons": [
      "Amount is below the wallet max limit.",
      "Recipient is not yet allowlisted, so manual approval is required."
    ]
  }
}
```

### 2. Get Payment Request Detail

`GET /api/payment-requests/:id`

Returns:

- request status
- parsed intent
- policy result
- approvals
- execution data
- proof data
- audit history

### 3. Approve or Reject Payment

`POST /api/payment-requests/:id/approval`

Request:

```json
{
  "decision": "approved",
  "approvedByWallet": "0xabc...",
  "note": "Looks correct"
}
```

Response:

```json
{
  "status": "approved"
}
```

### 4. Build Transaction Payload

`POST /api/payment-requests/:id/transaction-payload`

Response:

```json
{
  "to": "0xdef...",
  "value": "10000000000000000",
  "chainId": 84532
}
```

### 5. Record Broadcasted Transaction

`POST /api/payment-requests/:id/transactions`

Request:

```json
{
  "txHash": "0x123...",
  "chainId": 84532
}
```

Response:

```json
{
  "status": "submitted",
  "explorerUrl": "https://sepolia.basescan.org/tx/0x123..."
}
```

### 6. Confirm Transaction and Save Proof

`POST /api/payment-requests/:id/finalize`

Request:

```json
{
  "txHash": "0x123..."
}
```

Behavior:

- fetch chain receipt
- create receipt bundle hash
- optionally anchor hash on-chain
- store proof record

Response:

```json
{
  "status": "executed",
  "proof": {
    "payloadHash": "sha256...",
    "anchorTxHash": "0x456..."
  }
}
```

### 7. List Payment Requests

`GET /api/payment-requests`

Query params:

- `status`
- `limit`

### 8. Policy Rules

`GET /api/policy-rules`

`POST /api/policy-rules`

Example create request:

```json
{
  "ruleType": "max_amount",
  "ruleConfig": {
    "maxAmountEth": "0.02"
  }
}
```

## Error Contract

```json
{
  "error": {
    "code": "INVALID_AI_OUTPUT",
    "message": "Structured intent could not be validated."
  }
}
```

## Validation Rules

- reject if address is invalid
- reject if amount is zero or negative
- reject if token is unsupported
- reject if chain is not Base Sepolia
- reject if payment request is not approved before payload generation
