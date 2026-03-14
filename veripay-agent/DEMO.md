# 2-Minute Demo Script

## 0:00 - 0:15 Intro

"This is VeriPay Agent, a policy and verification layer for Bankr-powered agent payments. We let agents pay safely by enforcing guardrails and producing proof for every transfer."

## 0:15 - 0:40 Create Request

"I will enter a natural-language request: pay 0.01 ETH to 0x... for design review. Gemini extracts the recipient, amount, and reason into a structured intent."

## 0:40 - 1:00 Policy Verdict

"Now we run the policy engine. It applies max spend, recipient checks, and allowlist logic. The verdict and resolution appear here."

## 1:00 - 1:20 Permit

"With policy approval, we mint a one-time Execution Permit. It locks recipient, asset, amount, and expiry so the agent cannot deviate."

## 1:20 - 1:45 Execute With Bankr

"We execute the permit through Bankr. In rehearsal mode this generates a proof hash. On mainnet, Bankr submits a live transaction and returns a receipt."

## 1:45 - 2:00 Proof and Audit

"The receipt, proof hash, and audit trail are persisted in Supabase. This is a complete chain of custody from prompt to onchain result."
