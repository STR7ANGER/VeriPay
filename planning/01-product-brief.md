# Product Brief

## One-line Pitch

`VeriPay Agent` is a policy and verification layer for Bankr-powered agent payments.

## Product Direction

We are building a narrow trust layer:

`natural-language payment intent -> policy evaluation -> bounded execution permit -> Bankr execution -> proof trail`

## Why This Version Is Stronger

- it directly fits the Bankr partner track
- it preserves the original safety thesis
- it rewards real onchain outcomes instead of simulated flows
- it gives judges a clear human-agent collaboration story

## Primary Demo Flow

1. User submits a payment request in plain English.
2. Gemini extracts a `PaymentIntentDraft`.
3. VeriPay returns a `PolicyVerdict`.
4. User approves the bounded request and mints an `ExecutionPermit`.
5. VeriPay sends the approved transfer through Bankr.
6. VeriPay stores the execution receipt, proof hash, and audit trail.

## Success Criteria

The project is successful if a judge can see:

- the original prompt
- the structured intent
- the policy verdict
- the bounded permit
- the execution result
- the proof and audit timeline
