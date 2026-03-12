"use client";

import { FormEvent, useState, useTransition } from "react";
import { WalletStatusCard } from "@/components/payments/wallet-status-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <Badge>Payment request</Badge>
              <CardTitle className="mt-3">
                Describe the payment in plain English
              </CardTitle>
              <CardDescription>
                The AI only extracts intent. No value transfer happens in this
                phase.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(samplePrompt)}
            >
              Use sample
            </Button>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit}>
              <label className="block">
                <span className="mb-3 block text-sm font-medium text-stone-700">
                  Prompt
                </span>
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={7}
                  placeholder="Pay 0.001 ETH to 0x... for design work"
                />
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Extracting intent..." : "Create intent draft"}
                </Button>
                <p className="text-sm text-stone-600">
                  Gemini is used only for extraction. No transaction execution
                  is triggered here.
                </p>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-[#1f1a16] text-stone-50 shadow-[0_30px_80px_rgba(53,33,9,0.16)]">
        <CardHeader>
          <Badge variant="muted">Extraction result</Badge>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
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
              <ResultCard
                label="Explanation"
                value={result.intent.explanation}
              />

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
            <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Nothing extracted yet</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
                Submit a payment request from the left panel. The API route will
                validate your input, call Gemini, normalize the result, and send
                back a typed `PaymentIntentDraft`.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
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
