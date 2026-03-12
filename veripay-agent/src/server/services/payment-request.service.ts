import { parseEther } from "viem";
import { extractPaymentIntentWithGemini } from "@/server/providers/gemini.provider";
import type { PaymentIntentDraft } from "@/server/domain/payment-intent";
import {
  createPaymentRequestResponseSchema,
  paymentIntentDraftSchema,
  type CreatePaymentRequestInput,
} from "@/server/validators/payment-intent";

export async function createPaymentRequest(input: CreatePaymentRequestInput) {
  const extracted = await extractPaymentIntentWithGemini({
    rawPrompt: input.rawPrompt,
    walletAddress: input.walletAddress,
  });

  const normalized: PaymentIntentDraft = paymentIntentDraftSchema.parse({
    recipientAddress: extracted.recipientAddress,
    amountEth: extracted.amountEth,
    amountWei: parseEther(extracted.amountEth).toString(),
    tokenSymbol: "ETH",
    reason: extracted.reason,
    confidenceScore: extracted.confidenceScore,
    explanation: extracted.explanation,
    rawExtractedJson: extracted,
  });

  return createPaymentRequestResponseSchema.parse({
    paymentRequestId: crypto.randomUUID(),
    status: "pending_review",
    intent: normalized,
  });
}
