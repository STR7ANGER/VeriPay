import { isAddress, parseEther } from "viem";
import type {
  PaymentIntentDraft,
  PolicyVerdict,
  RecipientResolution,
} from "@/server/validators/payment-intent";

const DEFAULT_MAX_AMOUNT_ETH = process.env.VERIPAY_MAX_AMOUNT_ETH ?? "0.02";

function parseAllowlist() {
  const allowlist = process.env.VERIPAY_ALLOWLIST;

  if (!allowlist) {
    return [];
  }

  return allowlist
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.toLowerCase());
}

function classifyRecipient(input: string): RecipientResolution {
  if (isAddress(input)) {
    return {
      input,
      kind: "address",
      status: "direct_address",
      resolvedAddress: input,
      resolutionSource: "local",
      message: "Recipient is already an explicit EVM address.",
    };
  }

  if (input.endsWith(".eth")) {
    return {
      input,
      kind: "ens",
      status: "unresolved",
      resolutionSource: "none",
      message:
        "ENS recipient detected. Bankr can resolve this later, but VeriPay requires an explicit address before permit issuance.",
    };
  }

  if (
    input.startsWith("@") ||
    input.includes("twitter.com/") ||
    input.includes("warpcast.com/")
  ) {
    return {
      input,
      kind: "social",
      status: "unresolved",
      resolutionSource: "none",
      message:
        "Social recipient detected. This is useful for Bankr integration, but this MVP requires a resolved address before permit issuance.",
    };
  }

  return {
    input,
    kind: "unknown",
    status: "unresolved",
    resolutionSource: "none",
    message:
      "Recipient is not a recognized EVM address or supported resolver format.",
  };
}

export function evaluatePolicy(intent: PaymentIntentDraft): PolicyVerdict {
  const maxAmountEth = DEFAULT_MAX_AMOUNT_ETH;
  const maxAmountWei = parseEther(maxAmountEth);
  const amountWei = parseEther(intent.amountEth);
  const recipientResolution = classifyRecipient(intent.recipient);
  const allowlist = parseAllowlist();
  const reasons: string[] = [];
  let verdict: PolicyVerdict["verdict"] = "approved";
  let riskScore = 12;

  if (amountWei > maxAmountWei) {
    verdict = "blocked";
    riskScore = 78;
    reasons.push(
      `Requested amount exceeds the current max execution policy of ${maxAmountEth} ETH.`,
    );
  } else {
    reasons.push(
      `Requested amount is within the current policy cap of ${maxAmountEth} ETH.`,
    );
  }

  if (allowlist.length > 0) {
    const normalizedRecipient =
      recipientResolution.resolvedAddress?.toLowerCase();
    if (!normalizedRecipient || !allowlist.includes(normalizedRecipient)) {
      verdict = "blocked";
      riskScore = Math.max(riskScore, 85);
      reasons.push("Recipient is not present in the configured allowlist.");
    } else {
      reasons.push("Recipient matches the configured allowlist.");
    }
  }

  if (
    recipientResolution.status !== "direct_address" &&
    verdict !== "blocked"
  ) {
    verdict = "manual_review";
    riskScore = Math.max(riskScore, 42);
    reasons.push(
      "Recipient still needs explicit resolution before VeriPay can mint an execution permit.",
    );
  }

  if (intent.confidence < 0.75 && verdict !== "blocked") {
    verdict = "manual_review";
    riskScore = Math.max(riskScore, 55);
    reasons.push(
      "The extraction confidence is below the auto-approve threshold.",
    );
  }

  if (reasons.length === 0) {
    reasons.push("No policy rules were triggered.");
  }

  return {
    verdict,
    reasons,
    riskScore,
    maxAmountEth,
    recipientResolution,
    evaluatedAt: new Date().toISOString(),
  };
}
