# Product Brief

## One-line Pitch

`VeriPay Agent` lets an AI agent prepare and execute payments safely by forcing every payment through structured intent extraction, policy checks, approval rules, and a verifiable audit trail.

## Problem

AI agents can increasingly operate wallets and trigger transactions, but current agent-driven payment flows are unsafe for real users because:

- payment decisions are opaque
- approval logic is ad hoc
- policy constraints are rarely enforced consistently
- audit trails are weak or non-verifiable
- users cannot prove what the agent intended versus what was executed

## Why This Can Win

This idea is strong for a hackathon because it sits at the intersection of:

- AI agents
- crypto payments
- safety and trust
- on-chain verifiability

Judges can understand the problem quickly, and the demo can show a full end-to-end loop with visible proof.

## Narrow MVP Scope

We are not building a generic agent wallet platform.

We are building one narrow product:

`An AI-powered payment operator for small teams, freelancers, and builders using Base Sepolia.`

## Primary User Story

The user types:

`Pay 0.01 ETH to Rohan for landing page design work`

System behavior:

1. AI converts this into a structured payment intent.
2. Policy engine evaluates it against configured rules.
3. The system displays risk and reasoning.
4. User approves in the UI.
5. Wallet signs and sends the transaction.
6. Audit log and proof record are stored.
7. A hash of the final receipt can be anchored on-chain.

## Demo Promise

By the end of the hackathon, the demo should prove:

- an AI can interpret payment instructions
- the system does not trust the AI blindly
- policies are machine-enforced
- the human stays in control
- the resulting action is verifiable later

## Core Product Principles

- AI proposes, policy constrains, human approves
- every payment has a traceable lifecycle
- all critical state changes are logged
- verification is a feature, not a backend detail
- one clean workflow is better than five shallow features

## Success Criteria

The project is successful if a judge can see, in under 2 minutes:

- the payment request
- the extracted payment intent
- the policy result
- the approval gate
- the final transaction
- the proof trail
