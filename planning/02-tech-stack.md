# Tech Stack Decisions

## Core Stack

- `Next.js 16`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Gemini` for intent extraction
- `Bankr Submit API` for execution
- `Supabase Postgres` for persistence in the next phase

## Execution Architecture

### Primary

`Bankr` is the load-bearing execution layer.

Reason:

- it matches the Companion Lab Co. track directly
- it gives us a real execution story
- it lets VeriPay focus on policy, permits, and proof

### AI Model

Keep `Gemini` as the extraction model.

Do not move to Bankr's LLM gateway for the MVP.

## Network Strategy

- rehearsal: `Base Sepolia`
- final demo target: `Base Mainnet`

Important:

- Sepolia is for rehearsal only
- the final bounty path should include one small live transfer on a supported live chain
