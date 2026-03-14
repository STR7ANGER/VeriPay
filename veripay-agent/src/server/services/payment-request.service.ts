import { parseEther } from "viem";
import { AppError } from "@/server/errors/app-error";
import { submitTransferWithBankr } from "@/server/providers/bankr.provider";
import { extractPaymentIntentWithGemini } from "@/server/providers/gemini.provider";
import {
  getPaymentRequest,
  savePaymentRequest,
} from "@/server/repositories/payment-request.repository";
import { evaluatePolicy } from "@/server/services/policy-engine.service";
import { createNonce, createProofHash } from "@/server/services/proof.service";
import {
  createExecutionPermitInputSchema,
  createPaymentRequestInputSchema,
  executePaymentRequestInputSchema,
  paymentIntentDraftSchema,
  paymentRequestRecordSchema,
  type AuditEvent,
  type CreateExecutionPermitInput,
  type CreatePaymentRequestInput,
  type ExecutePaymentRequestInput,
  type PaymentRequestRecord,
} from "@/server/validators/payment-intent";

const CHAIN_CONFIG = {
  base: {
    chainId: 8453,
    label: "Base Mainnet",
    explorer: "https://basescan.org/tx/",
  },
  "base-sepolia": {
    chainId: 84532,
    label: "Base Sepolia",
    explorer: "https://sepolia.basescan.org/tx/",
  },
} as const;

function now() {
  return new Date().toISOString();
}

function makeAuditEvent(
  actorType: AuditEvent["actorType"],
  eventType: string,
  message: string,
  payload?: unknown,
): AuditEvent {
  return {
    id: crypto.randomUUID(),
    actorType,
    eventType,
    message,
    payload,
    createdAt: now(),
  };
}

function appendAudit(
  record: PaymentRequestRecord,
  actorType: AuditEvent["actorType"],
  eventType: string,
  message: string,
  payload?: unknown,
) {
  record.auditTrail.push(
    makeAuditEvent(actorType, eventType, message, payload),
  );
}

async function loadPaymentRequest(paymentRequestId: string) {
  const record = await getPaymentRequest(paymentRequestId);

  if (!record) {
    throw new AppError("Payment request not found.", {
      code: "PAYMENT_REQUEST_NOT_FOUND",
      statusCode: 404,
    });
  }

  return record;
}

export async function createPaymentRequest(
  rawInput: CreatePaymentRequestInput,
) {
  const input = createPaymentRequestInputSchema.parse(rawInput);
  const extracted = await extractPaymentIntentWithGemini({
    rawPrompt: input.rawPrompt,
  });

  const recipient = extracted.recipient.trim();
  const recipientKind = recipient.startsWith("0x")
    ? "address"
    : recipient.endsWith(".eth")
      ? "ens"
      : recipient.startsWith("@") ||
          recipient.includes("twitter.com/") ||
          recipient.includes("warpcast.com/")
        ? "social"
        : "unknown";

  const normalizedIntent = paymentIntentDraftSchema.parse({
    recipient,
    recipientKind,
    amountEth: extracted.amountEth,
    amountWei: parseEther(extracted.amountEth).toString(),
    asset: "ETH",
    reason: extracted.reason,
    confidence: extracted.confidenceScore,
    explanation: extracted.explanation,
    executionMode: "bankr_transfer",
    rawExtractedJson: extracted,
  });

  const timestamp = now();
  const record = paymentRequestRecordSchema.parse({
    paymentRequestId: crypto.randomUUID(),
    rawPrompt: input.rawPrompt,
    status: "intent_created",
    createdAt: timestamp,
    updatedAt: timestamp,
    intent: normalizedIntent,
    policyVerdict: null,
    permit: null,
    executionReceipt: null,
    auditTrail: [
      makeAuditEvent(
        "user",
        "payment_request_created",
        "Payment request captured from natural language input.",
        { rawPrompt: input.rawPrompt },
      ),
      makeAuditEvent(
        "ai",
        "intent_extracted",
        "Gemini extracted a structured Bankr transfer intent.",
        normalizedIntent,
      ),
    ],
  });

  return await savePaymentRequest(record);
}

export async function getPaymentRequestDetail(paymentRequestId: string) {
  return await loadPaymentRequest(paymentRequestId);
}

export async function evaluatePaymentRequestPolicy(paymentRequestId: string) {
  const record = await loadPaymentRequest(paymentRequestId);
  const policyVerdict = evaluatePolicy(record.intent);

  record.policyVerdict = policyVerdict;
  record.status =
    policyVerdict.verdict === "blocked" ? "blocked" : "policy_ready";
  record.updatedAt = now();

  appendAudit(
    record,
    "system",
    "policy_evaluated",
    `Policy evaluation completed with verdict: ${policyVerdict.verdict}.`,
    policyVerdict,
  );

  return await savePaymentRequest(record);
}

export async function createExecutionPermit(
  paymentRequestId: string,
  rawInput: CreateExecutionPermitInput,
) {
  const input = createExecutionPermitInputSchema.parse(rawInput);
  const record = await loadPaymentRequest(paymentRequestId);

  if (!record.policyVerdict) {
    throw new AppError("Run policy evaluation before creating a permit.", {
      code: "POLICY_NOT_EVALUATED",
      statusCode: 409,
    });
  }

  if (record.policyVerdict.verdict === "blocked") {
    throw new AppError("Blocked requests cannot mint execution permits.", {
      code: "REQUEST_BLOCKED",
      statusCode: 409,
      details: record.policyVerdict,
    });
  }

  const resolvedAddress =
    record.policyVerdict.recipientResolution.resolvedAddress;

  if (!resolvedAddress) {
    throw new AppError(
      "Recipient must resolve to an explicit address before permit issuance.",
      {
        code: "RECIPIENT_UNRESOLVED",
        statusCode: 409,
      },
    );
  }

  const createdAt = now();
  const expiresAt = new Date(
    Date.now() + input.expiryMinutes * 60 * 1000,
  ).toISOString();

  record.permit = {
    id: crypto.randomUUID(),
    paymentRequestId: record.paymentRequestId,
    allowedRecipient: resolvedAddress,
    allowedAsset: "ETH",
    maxAmountEth: record.policyVerdict.maxAmountEth,
    maxAmountWei: parseEther(record.policyVerdict.maxAmountEth).toString(),
    chainTarget: input.chainTarget,
    expiresAt,
    nonce: createNonce(),
    approvalArtifact: {
      approvedBy: "human_review",
      approvedAt: createdAt,
      note: input.note,
    },
    createdAt,
  };

  record.status = "permitted";
  record.updatedAt = now();

  appendAudit(
    record,
    "user",
    "permit_created",
    `Execution permit minted for ${CHAIN_CONFIG[input.chainTarget].label}.`,
    record.permit,
  );

  return await savePaymentRequest(record);
}

export async function executePaymentRequest(
  paymentRequestId: string,
  rawInput: ExecutePaymentRequestInput,
) {
  const input = executePaymentRequestInputSchema.parse(rawInput);
  const record = await loadPaymentRequest(paymentRequestId);

  if (!record.permit) {
    throw new AppError("Create an execution permit before executing.", {
      code: "PERMIT_REQUIRED",
      statusCode: 409,
    });
  }

  if (record.permit.chainTarget !== input.chainTarget) {
    throw new AppError("Execution chain does not match the approved permit.", {
      code: "CHAIN_MISMATCH",
      statusCode: 409,
    });
  }

  if (new Date(record.permit.expiresAt).getTime() < Date.now()) {
    throw new AppError("Execution permit has expired.", {
      code: "PERMIT_EXPIRED",
      statusCode: 409,
    });
  }

  const chain = CHAIN_CONFIG[input.chainTarget];
  const receiptBase = {
    id: crypto.randomUUID(),
    paymentRequestId: record.paymentRequestId,
    provider: "bankr" as const,
    chainTarget: input.chainTarget,
    chainId: chain.chainId,
    createdAt: now(),
    updatedAt: now(),
  };

  const rehearsalPayload = {
    rawPrompt: record.rawPrompt,
    intent: record.intent,
    policyVerdict: record.policyVerdict,
    permit: record.permit,
    rehearsal: {
      chainTarget: input.chainTarget,
      reason:
        "Base Sepolia is treated as rehearsal mode in VeriPay while Bankr handles live execution on supported chains.",
    },
  };

  if (input.chainTarget === "base-sepolia") {
    record.executionReceipt = {
      ...receiptBase,
      status: "simulated",
      proofHash: createProofHash(rehearsalPayload),
      message:
        "Rehearsal mode only. Switch the permit to Base mainnet and configure BANKR_API_KEY for a live Bankr submission.",
    };
    record.status = "rehearsed";
    record.updatedAt = now();

    appendAudit(
      record,
      "system",
      "execution_rehearsed",
      "Generated a rehearsal receipt instead of a live Bankr submission.",
      record.executionReceipt,
    );

    return await savePaymentRequest(record);
  }

  try {
    const bankrResponse = await submitTransferWithBankr({
      to: record.permit.allowedRecipient,
      value: record.intent.amountWei,
      chainId: chain.chainId,
      description: `VeriPay Agent approved transfer: ${record.intent.reason}`,
      waitForConfirmation: input.waitForConfirmation,
    });

    const proofHash = createProofHash({
      rawPrompt: record.rawPrompt,
      intent: record.intent,
      policyVerdict: record.policyVerdict,
      permit: record.permit,
      bankrResponse,
    });

    const transactionHash = bankrResponse.transactionHash;
    const explorerUrl = transactionHash
      ? `${chain.explorer}${transactionHash}`
      : undefined;
    const mappedStatus =
      bankrResponse.status === "pending"
        ? "submitted"
        : bankrResponse.status === "success"
          ? "confirmed"
          : "failed";

    record.executionReceipt = {
      ...receiptBase,
      status: mappedStatus,
      transactionHash,
      blockNumber: bankrResponse.blockNumber,
      signer: bankrResponse.signer,
      bankrRequestId: transactionHash,
      proofHash,
      explorerUrl,
      message:
        mappedStatus === "confirmed"
          ? "Bankr submitted and confirmed the approved payment."
          : mappedStatus === "submitted"
            ? "Bankr submitted the payment and it is awaiting confirmation."
            : "Bankr returned a non-success execution status.",
      rawResponse: bankrResponse,
      updatedAt: now(),
    };

    record.status = mappedStatus === "failed" ? "failed" : "executed";
    record.updatedAt = now();

    appendAudit(
      record,
      "partner",
      "bankr_execution_completed",
      `Bankr execution completed with status: ${mappedStatus}.`,
      record.executionReceipt,
    );
  } catch (error) {
    const message =
      error instanceof AppError
        ? error.message
        : "Unknown Bankr execution error.";
    const details = error instanceof AppError ? error.details : undefined;

    record.executionReceipt = {
      ...receiptBase,
      status: "failed",
      proofHash: createProofHash({
        rawPrompt: record.rawPrompt,
        intent: record.intent,
        policyVerdict: record.policyVerdict,
        permit: record.permit,
        error: { message, details },
      }),
      message,
      rawResponse: details,
      updatedAt: now(),
    };
    record.status = "failed";
    record.updatedAt = now();

    appendAudit(
      record,
      "partner",
      "bankr_execution_failed",
      "Bankr execution failed but the failure was preserved for auditability.",
      record.executionReceipt,
    );
  }

  return await savePaymentRequest(record);
}
