# VeriPay Agent Submission Pack

## Short Description

VeriPay Agent turns natural-language payment requests into policy-checked, bounded execution permits and routes approved transfers through Bankr. It delivers human-controlled, auditable agent payments with real onchain outcomes.

## Long Description

VeriPay Agent is a policy and verification layer for Bankr-powered agent payments. Users describe a payment in plain language, Gemini extracts a structured intent, and a deterministic policy engine evaluates risk and recipient resolution. Approved requests mint a one-time Execution Permit that constrains recipient, asset, and amount. The execution step calls Bankr to submit the transaction and stores the receipt, proof hash, and audit trail so every transfer is traceable.

## Bankr Usage

- Load-bearing Bankr execution for approved transfers.
- Proof and receipt capture from Bankr responses.

## Key Features

- Natural-language payment intent extraction with Gemini.
- Deterministic policy evaluation and recipient resolution.
- Bounded, expiring execution permits.
- Bankr-backed live execution with rehearsal mode.
- Proof hash and audit timeline for verification.

## Tech Stack

- Next.js 16, TypeScript, Tailwind, shadcn/ui
- wagmi + viem
- Gemini API
- Bankr Submit API
- Supabase Postgres

## Demo Steps

1. Submit a natural-language payment request.
2. Review the parsed intent and policy verdict.
3. Mint the execution permit.
4. Execute via Bankr and show the receipt and proof hash.
