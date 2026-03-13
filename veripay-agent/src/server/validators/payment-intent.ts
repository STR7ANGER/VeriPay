import { z } from "zod";

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
const txHashRegex = /^0x[a-fA-F0-9]+$/;

export const chainTargetSchema = z.enum(["base", "base-sepolia"]);
export const paymentRequestStatusSchema = z.enum([
  "intent_created",
  "policy_ready",
  "blocked",
  "permitted",
  "executed",
  "rehearsed",
  "failed",
]);
export const recipientKindSchema = z.enum([
  "address",
  "ens",
  "social",
  "unknown",
]);

export const createPaymentRequestInputSchema = z.object({
  rawPrompt: z.string().min(10),
});

export const paymentIntentDraftSchema = z.object({
  recipient: z.string().min(2),
  recipientKind: recipientKindSchema,
  amountEth: z.string().min(1),
  amountWei: z.string().min(1),
  asset: z.literal("ETH"),
  reason: z.string().min(2),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(4),
  executionMode: z.literal("bankr_transfer"),
  rawExtractedJson: z.unknown(),
});

export const recipientResolutionSchema = z.object({
  input: z.string(),
  kind: recipientKindSchema,
  status: z.enum(["resolved", "direct_address", "unresolved"]),
  resolvedAddress: z.string().regex(addressRegex).optional(),
  resolutionSource: z.enum(["local", "bankr", "none"]),
  message: z.string(),
});

export const policyVerdictSchema = z.object({
  verdict: z.enum(["approved", "manual_review", "blocked"]),
  reasons: z.array(z.string()).min(1),
  riskScore: z.number().int().min(0).max(100),
  maxAmountEth: z.string(),
  recipientResolution: recipientResolutionSchema,
  evaluatedAt: z.string().datetime(),
});

export const approvalArtifactSchema = z.object({
  approvedBy: z.literal("human_review"),
  approvedAt: z.string().datetime(),
  note: z.string().optional(),
});

export const executionPermitSchema = z.object({
  id: z.string().uuid(),
  paymentRequestId: z.string().uuid(),
  allowedRecipient: z.string().regex(addressRegex),
  allowedAsset: z.literal("ETH"),
  maxAmountEth: z.string(),
  maxAmountWei: z.string(),
  chainTarget: chainTargetSchema,
  expiresAt: z.string().datetime(),
  nonce: z.string().min(8),
  approvalArtifact: approvalArtifactSchema,
  createdAt: z.string().datetime(),
});

export const executionReceiptSchema = z.object({
  id: z.string().uuid(),
  paymentRequestId: z.string().uuid(),
  provider: z.literal("bankr"),
  chainTarget: chainTargetSchema,
  chainId: z.number().int(),
  status: z.enum(["simulated", "submitted", "confirmed", "failed"]),
  bankrRequestId: z.string().optional(),
  transactionHash: z.string().regex(txHashRegex).optional(),
  blockNumber: z.string().optional(),
  signer: z.string().regex(addressRegex).optional(),
  proofHash: z.string(),
  explorerUrl: z.string().url().optional(),
  message: z.string(),
  rawResponse: z.unknown().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const auditEventSchema = z.object({
  id: z.string().uuid(),
  actorType: z.enum(["user", "ai", "system", "partner"]),
  eventType: z.string().min(2),
  message: z.string().min(2),
  payload: z.unknown().optional(),
  createdAt: z.string().datetime(),
});

export const paymentRequestRecordSchema = z.object({
  paymentRequestId: z.string().uuid(),
  rawPrompt: z.string(),
  status: paymentRequestStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  intent: paymentIntentDraftSchema,
  policyVerdict: policyVerdictSchema.nullable(),
  permit: executionPermitSchema.nullable(),
  executionReceipt: executionReceiptSchema.nullable(),
  auditTrail: z.array(auditEventSchema),
});

export const createExecutionPermitInputSchema = z.object({
  chainTarget: chainTargetSchema.default("base-sepolia"),
  expiryMinutes: z.number().int().min(1).max(60).default(15),
  note: z.string().max(280).optional(),
});

export const executePaymentRequestInputSchema = z.object({
  chainTarget: chainTargetSchema,
  waitForConfirmation: z.boolean().default(true),
});

export type CreatePaymentRequestInput = z.infer<
  typeof createPaymentRequestInputSchema
>;
export type ChainTarget = z.infer<typeof chainTargetSchema>;
export type PaymentIntentDraft = z.infer<typeof paymentIntentDraftSchema>;
export type RecipientResolution = z.infer<typeof recipientResolutionSchema>;
export type PolicyVerdict = z.infer<typeof policyVerdictSchema>;
export type ExecutionPermit = z.infer<typeof executionPermitSchema>;
export type ExecutionReceipt = z.infer<typeof executionReceiptSchema>;
export type AuditEvent = z.infer<typeof auditEventSchema>;
export type PaymentRequestRecord = z.infer<typeof paymentRequestRecordSchema>;
export type CreateExecutionPermitInput = z.infer<
  typeof createExecutionPermitInputSchema
>;
export type ExecutePaymentRequestInput = z.infer<
  typeof executePaymentRequestInputSchema
>;
