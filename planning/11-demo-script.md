# 2-Minute Demo Script

## Demo Goal

Show that AI can prepare payments, but the system makes them safe and verifiable.

## Script

### 0:00 - 0:20

`Today, AI agents can trigger financial actions, but users cannot safely trust opaque payment decisions. VeriPay Agent fixes that by making every AI-driven payment structured, policy-checked, human-approved, and verifiable.`

### 0:20 - 0:40

Show wallet connected on Base Sepolia.

`I’m connected with Phantom. Now I’ll give the agent a plain-English instruction.`

Type:

`Pay 0.001 ETH to 0x... for landing page design`

### 0:40 - 1:05

Show parsed intent card.

`The AI converts the request into structured payment intent: recipient, amount, token, and reason. But the AI does not get direct execution power.`

### 1:05 - 1:25

Show policy result.

`Next, our deterministic policy engine checks limits and recipient rules, then explains the risk level and whether manual review is required.`

### 1:25 - 1:45

Approve and execute.

`Once I approve, the transaction is signed from my wallet and sent on Base Sepolia.`

### 1:45 - 2:00

Show explorer link, audit timeline, and proof hash.

`Now we have a full trace: original request, extracted intent, policy verdict, wallet transaction, and a verifiable proof record. So the agent can help with payments without becoming a black box.`

## Demo Checklist

- pre-fund wallet
- pre-add Base Sepolia in Phantom
- keep one known recipient ready
- keep one happy-path prompt ready
- keep one blocked example ready if time permits
