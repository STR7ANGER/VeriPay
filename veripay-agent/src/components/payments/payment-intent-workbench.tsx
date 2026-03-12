"use client";

import { FormEvent, useState, useTransition } from "react";
import { WalletStatusCard } from "@/components/payments/wallet-status-card";
import type { CreatePaymentRequestResponse } from "@/server/validators/payment-intent";

const samplePrompt =
  "Pay 0.001 ETH to 0x1111111111111111111111111111111111111111 for landing page design work";

type PaymentIntentErrorResponse = {
  error?: {
    message?: string;
  };
};

export function PaymentIntentWorkbench() {
  const [prompt, setPrompt] = useState(samplePrompt);
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [result, setResult] = useState<CreatePaymentRequestResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/payment-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawPrompt: prompt,
          walletAddress,
        }),
      });

      const json = (await response.json()) as
        | CreatePaymentRequestResponse
        | PaymentIntentErrorResponse;

      if (!response.ok) {
        const errorResponse = json as PaymentIntentErrorResponse;
        setResult(null);
        setError(
          errorResponse.error?.message ??
            "Unable to create a payment intent draft.",
        );
        return;
      }

      setResult(json as CreatePaymentRequestResponse);
    });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <WalletStatusCard
          walletAddress={walletAddress}
          onWalletConnected={setWalletAddress}
        />

        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_30px_80px_rgba(53,33,9,0.14)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.26em] text-stone-500 uppercase">
                Payment request
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Describe the payment in plain English
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPrompt(samplePrompt)}
              className="rounded-full border border-stone-900/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase text-stone-700 transition hover:bg-stone-100"
            >
              Use sample
            </button>
          </div>

          <label className="mt-6 block">
            <span className="mb-3 block text-sm font-medium text-stone-700">
              Prompt
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={7}
              className="w-full rounded-[1.5rem] border border-stone-900/10 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-900 outline-none transition focus:border-stone-400"
              placeholder="Pay 0.001 ETH to 0x... for design work"
            />
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isPending ? "Extracting intent..." : "Create intent draft"}
            </button>
            <p className="text-sm text-stone-600">
              Gemini is used only for extraction. No transaction execution is
              triggered here.
            </p>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </form>
      </div>

      <div className="rounded-[2rem] border border-stone-900/10 bg-[#1f1a16] p-6 text-stone-50 shadow-[0_30px_80px_rgba(53,33,9,0.16)]">
        <p className="text-xs font-semibold tracking-[0.28em] text-stone-400 uppercase">
          Extraction result
        </p>
        {result ? (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Structured payment intent
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Request ID:{" "}
                <span className="font-mono">{result.paymentRequestId}</span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Recipient"
                value={result.intent.recipientAddress}
              />
              <ResultCard
                label="Amount"
                value={`${result.intent.amountEth} ETH`}
              />
              <ResultCard label="Token" value={result.intent.tokenSymbol} />
              <ResultCard
                label="Confidence"
                value={`${Math.round(result.intent.confidenceScore * 100)}%`}
              />
            </div>

            <ResultCard label="Reason" value={result.intent.reason} />
            <ResultCard label="Explanation" value={result.intent.explanation} />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-stone-400 uppercase">
                Raw extracted JSON
              </p>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-stone-200">
                {JSON.stringify(result.intent.rawExtractedJson, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Nothing extracted yet</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
              Submit a payment request from the left panel. The API route will
              validate your input, call Gemini, normalize the result, and send
              back a typed `PaymentIntentDraft`.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold tracking-[0.24em] text-stone-400 uppercase">
        {label}
      </p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-50">{value}</p>
    </div>
  );
}
