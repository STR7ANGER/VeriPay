import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,189,108,0.25),_transparent_30%),linear-gradient(180deg,_#f7f4ed_0%,_#efe8db_100%)] px-6 py-10 text-stone-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-stone-900/15 bg-white/70 px-4 py-2 text-sm font-medium tracking-[0.18em] uppercase shadow-sm backdrop-blur">
              VeriPay Agent
            </div>
            <div className="space-y-5">
              <p className="max-w-2xl text-sm font-medium tracking-[0.22em] text-stone-600 uppercase">
                Policy and verification for Bankr-powered agent payments
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl">
                Turn plain-English payment requests into bounded Bankr execution
                permits.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-stone-700">
                VeriPay Agent now treats Bankr as the load-bearing execution
                layer. Gemini extracts the intent, policy rules constrain it,
                and only a bounded permit can move forward to execution.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
              >
                Open workbench
              </Link>
              <a
                href="https://docs.bankr.bot/agent-api/submit-endpoint"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-950/15 bg-white/75 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
              >
                Bankr submit docs
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_30px_80px_rgba(53,33,9,0.14)] backdrop-blur">
            <p className="text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase">
              Current build scope
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold">What works now</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  <li>Gemini extraction into a Bankr transfer intent</li>
                  <li>Policy evaluation and recipient resolution status</li>
                  <li>Bounded execution permit generation</li>
                  <li>Bankr execution route plus proof and audit trail</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold">What comes next</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  <li>Supabase persistence for the lifecycle records</li>
                  <li>True live execution once a Bankr API key is added</li>
                  <li>
                    MetaMask delegations as a future wrapper around permits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
