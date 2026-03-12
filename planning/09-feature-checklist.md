# Feature Checklist

## MVP Features

| Feature | Status Target | Notes |
| --- | --- | --- |
| Connect Phantom wallet on Base Sepolia | Build | Generic injected EVM support |
| Natural-language payment input | Build | Single text area |
| AI extraction to structured payment intent | Build | Gemini + schema validation |
| Policy engine with 2-3 rule types | Build | Max amount, allowlist, manual review |
| Human approval UI | Build | Explicit approve/reject buttons |
| Transaction execution from wallet | Build | ETH only for MVP |
| Execution history | Build | Recent requests list |
| Audit timeline | Build | Show state transitions |
| Proof hash generation | Build | Deterministic receipt bundle |
| Optional on-chain anchor | Stretch | If time permits |

## Stretch Features

- recipient contacts book
- transaction simulation
- proof bundle export
- agent explanation comparison view
- suspicious prompt detection
- daily spend visualization

## Features To Avoid

- cross-chain support
- ERC-20 token routing
- autonomous payouts
- multi-user RBAC
- complex contract system unless anchor logic is trivial

## MVP Definition Of Done

The MVP is complete when:

1. a user can connect wallet
2. enter a payment request
3. see parsed intent
4. see policy verdict
5. approve it
6. send transaction
7. view history and proof hash
