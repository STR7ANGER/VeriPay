import { z } from "zod";

export const createPaymentRequestInputSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  rawPrompt: z.string().min(10),
});

export const paymentIntentDraftSchema = z.object({
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountEth: z.string().min(1),
  amountWei: z.string().min(1),
  tokenSymbol: z.literal("ETH"),
  reason: z.string().min(2),
  confidenceScore: z.number().min(0).max(1),
  explanation: z.string().min(4),
  rawExtractedJson: z.unknown(),
});

export const createPaymentRequestResponseSchema = z.object({
  paymentRequestId: z.string().uuid(),
  status: z.literal("pending_review"),
  intent: paymentIntentDraftSchema,
});

export type CreatePaymentRequestInput = z.infer<
  typeof createPaymentRequestInputSchema
>;
export type CreatePaymentRequestResponse = z.infer<
  typeof createPaymentRequestResponseSchema
>;
