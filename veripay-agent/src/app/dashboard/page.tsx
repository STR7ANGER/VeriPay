import { PaymentIntentWorkbench } from "@/components/payments/payment-intent-workbench";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7f4ed_0%,_#eee5d5_100%)] px-4 py-6 text-stone-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase">
            Phase 0 + Phase 1
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            Payment intent workbench
          </h1>
          <p className="max-w-3xl text-base leading-7 text-stone-700">
            Submit a natural-language payment request, let Gemini produce a
            structured intent draft, and review it before any policy evaluation
            or execution happens.
          </p>
        </div>
        <PaymentIntentWorkbench />
      </div>
    </main>
  );
}
