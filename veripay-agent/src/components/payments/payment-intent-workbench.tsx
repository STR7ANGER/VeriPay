"use client";

import { FormEvent, useState, useTransition } from "react";
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
import type {
  ChainTarget,
  PaymentRequestRecord,
} from "@/server/validators/payment-intent";

const samplePrompt =
  "Pay 0.001 ETH to 0x1111111111111111111111111111111111111111 for landing page design work";

type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

export function PaymentIntentWorkbench() {
  const [prompt, setPrompt] = useState(samplePrompt);
  const [record, setRecord] = useState<PaymentRequestRecord | null>(null);
  const [chainTarget, setChainTarget] = useState<ChainTarget>("base-sepolia");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAction = async (
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<PaymentRequestRecord | null> => {
    const response = await fetch(input, init);
    const json = (await response.json()) as
      | PaymentRequestRecord
      | ApiErrorResponse;

    if (!response.ok) {
      const errorResponse = json as ApiErrorResponse;
      setError(errorResponse.error?.message ?? "Action failed.");
      return null;
    }

    setError(null);
    return json as PaymentRequestRecord;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const next = await runAction("/api/payment-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawPrompt: prompt,
        }),
      });

      if (next) {
        setRecord(next);
      }
    });
  };

  const evaluatePolicy = () => {
    if (!record) {
      return;
    }

    startTransition(async () => {
      const next = await runAction(
        `/api/payment-requests/${record.paymentRequestId}/policy-evaluation`,
        {
          method: "POST",
        },
      );

      if (next) {
        setRecord(next);
      }
    });
  };

  const createPermit = () => {
    if (!record) {
      return;
    }

    startTransition(async () => {
      const next = await runAction(
        `/api/payment-requests/${record.paymentRequestId}/permit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chainTarget,
            expiryMinutes: 15,
            note: "Reviewed in the VeriPay dashboard.",
          }),
        },
      );

      if (next) {
        setRecord(next);
      }
    });
  };

  const executeViaBankr = () => {
    if (!record) {
      return;
    }

    startTransition(async () => {
      const next = await runAction(
        `/api/payment-requests/${record.paymentRequestId}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chainTarget,
            waitForConfirmation: true,
          }),
        },
      );

      if (next) {
        setRecord(next);
      }
    });
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Badge>Execution model</Badge>
            <CardTitle className="mt-3">
              Bankr-first delegated guardrails
            </CardTitle>
            <CardDescription>
              VeriPay uses Gemini for extraction, a local policy engine for
              safety, and Bankr as the load-bearing execution layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Partner"
                value="Bankr"
                helper="Execution substrate"
              />
              <MetricCard
                label="Mode"
                value="bankr_transfer"
                helper="Default execution mode"
              />
              <MetricCard
                label="Dev path"
                value="Base Sepolia"
                helper="Rehearsal receipt only"
              />
              <MetricCard
                label="Submission path"
                value="Base Mainnet"
                helper="Live Bankr transfer"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <Badge>Payment request</Badge>
              <CardTitle className="mt-3">
                Create the natural-language request
              </CardTitle>
              <CardDescription>
                This only creates a `PaymentIntentDraft`. Policy and permit
                stages happen explicitly after that.
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
                  {isPending ? "Creating..." : "Create request"}
                </Button>
                <p className="text-sm text-stone-600">
                  Partner-friendly flow: intent, policy, permit, then Bankr
                  execution.
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

        <Card>
          <CardHeader>
            <Badge>Execution target</Badge>
            <CardTitle className="mt-3">Choose the transfer path</CardTitle>
            <CardDescription>
              Base Sepolia is rehearsal mode. Base mainnet is the live Bankr
              path for the final demo once `BANKR_API_KEY` is configured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChainOption
                active={chainTarget === "base-sepolia"}
                title="Base Sepolia"
                description="Preview and proof rehearsal"
                onClick={() => setChainTarget("base-sepolia")}
              />
              <ChainOption
                active={chainTarget === "base"}
                title="Base Mainnet"
                description="Live Bankr submission"
                onClick={() => setChainTarget("base")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-white/5 bg-[#1f1a16] text-stone-50 shadow-[0_30px_80px_rgba(53,33,9,0.16)]">
          <CardHeader>
            <Badge variant="muted">Lifecycle state</Badge>
          </CardHeader>
          <CardContent>
            {record ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                      {record.status.replaceAll("_", " ")}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      Request ID:{" "}
                      <span className="font-mono">
                        {record.paymentRequestId}
                      </span>
                    </p>
                  </div>
                  <Badge variant="muted">Bankr execution badge</Badge>
                </div>

                <ActionStrip
                  canEvaluate={!record.policyVerdict}
                  canPermit={
                    !!record.policyVerdict &&
                    !record.permit &&
                    record.policyVerdict.verdict !== "blocked"
                  }
                  canExecute={!!record.permit && !record.executionReceipt}
                  isPending={isPending}
                  onEvaluate={evaluatePolicy}
                  onPermit={createPermit}
                  onExecute={executeViaBankr}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultCard
                    label="Recipient"
                    value={record.intent.recipient}
                  />
                  <ResultCard
                    label="Amount"
                    value={`${record.intent.amountEth} ${record.intent.asset}`}
                  />
                  <ResultCard
                    label="Confidence"
                    value={`${Math.round(record.intent.confidence * 100)}%`}
                  />
                  <ResultCard
                    label="Execution mode"
                    value={record.intent.executionMode}
                  />
                </div>

                <ResultCard label="Reason" value={record.intent.reason} />
                <ResultCard
                  label="AI explanation"
                  value={record.intent.explanation}
                />

                {record.policyVerdict ? (
                  <SectionPanel title="Policy verdict">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ResultCard
                        label="Verdict"
                        value={record.policyVerdict.verdict}
                      />
                      <ResultCard
                        label="Risk score"
                        value={`${record.policyVerdict.riskScore}/100`}
                      />
                      <ResultCard
                        label="Max amount"
                        value={`${record.policyVerdict.maxAmountEth} ETH`}
                      />
                      <ResultCard
                        label="Resolution status"
                        value={record.policyVerdict.recipientResolution.status}
                      />
                    </div>
                    <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold tracking-[0.24em] text-stone-400 uppercase">
                        Policy reasons
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-200">
                        {record.policyVerdict.reasons.map((reason) => (
                          <li key={reason}>- {reason}</li>
                        ))}
                      </ul>
                    </div>
                  </SectionPanel>
                ) : null}

                {record.permit ? (
                  <SectionPanel title="Execution permit">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ResultCard
                        label="Allowed recipient"
                        value={record.permit.allowedRecipient}
                      />
                      <ResultCard
                        label="Allowed asset"
                        value={record.permit.allowedAsset}
                      />
                      <ResultCard
                        label="Max amount"
                        value={`${record.permit.maxAmountEth} ETH`}
                      />
                      <ResultCard
                        label="Chain target"
                        value={record.permit.chainTarget}
                      />
                    </div>
                    <ResultCard
                      label="Approval artifact"
                      value={`${record.permit.approvalArtifact.approvedBy} at ${new Date(
                        record.permit.approvalArtifact.approvedAt,
                      ).toLocaleString()}`}
                    />
                  </SectionPanel>
                ) : null}

                {record.executionReceipt ? (
                  <SectionPanel title="Execution receipt">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ResultCard
                        label="Status"
                        value={record.executionReceipt.status}
                      />
                      <ResultCard
                        label="Chain"
                        value={record.executionReceipt.chainTarget}
                      />
                      <ResultCard
                        label="Tx hash"
                        value={record.executionReceipt.transactionHash ?? "n/a"}
                      />
                      <ResultCard
                        label="Proof hash"
                        value={record.executionReceipt.proofHash}
                      />
                    </div>
                    <ResultCard
                      label="Execution message"
                      value={record.executionReceipt.message}
                    />
                    {record.executionReceipt.explorerUrl ? (
                      <a
                        href={record.executionReceipt.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/10"
                      >
                        Open explorer
                      </a>
                    ) : null}
                  </SectionPanel>
                ) : null}

                <SectionPanel title="Audit timeline">
                  <div className="space-y-3">
                    {record.auditTrail.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-stone-50">
                            {event.eventType.replaceAll("_", " ")}
                          </p>
                          <Badge variant="muted">{event.actorType}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-stone-200">
                          {event.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </SectionPanel>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 p-6">
                <h2 className="text-xl font-semibold">
                  No request in progress yet
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-stone-300">
                  Create a payment request first. The dashboard will then walk
                  through policy evaluation, permit issuance, and Bankr-backed
                  execution or rehearsal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-stone-900/10 bg-stone-50 p-4">
      <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-stone-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-stone-600">{helper}</p>
    </div>
  );
}

function ChainOption({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border p-4 text-left transition ${
        active
          ? "border-stone-950 bg-stone-950 text-stone-50"
          : "border-stone-900/10 bg-stone-50 text-stone-950 hover:bg-stone-100"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p
        className={`mt-2 text-sm leading-6 ${
          active ? "text-stone-200" : "text-stone-600"
        }`}
      >
        {description}
      </p>
    </button>
  );
}

function ActionStrip({
  canEvaluate,
  canPermit,
  canExecute,
  isPending,
  onEvaluate,
  onPermit,
  onExecute,
}: {
  canEvaluate: boolean;
  canPermit: boolean;
  canExecute: boolean;
  isPending: boolean;
  onEvaluate: () => void;
  onPermit: () => void;
  onExecute: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant={canEvaluate ? "secondary" : "outline"}
        disabled={!canEvaluate || isPending}
        onClick={onEvaluate}
      >
        Evaluate policy
      </Button>
      <Button
        type="button"
        variant={canPermit ? "secondary" : "outline"}
        disabled={!canPermit || isPending}
        onClick={onPermit}
      >
        Mint permit
      </Button>
      <Button
        type="button"
        disabled={!canExecute || isPending}
        onClick={onExecute}
      >
        Execute via Bankr
      </Button>
    </div>
  );
}

function SectionPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold tracking-[0.24em] text-stone-400 uppercase">
        {title}
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
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
