export type PaymentIntentDraft = {
  recipientAddress: string;
  amountEth: string;
  amountWei: string;
  tokenSymbol: "ETH";
  reason: string;
  confidenceScore: number;
  explanation: string;
  rawExtractedJson: unknown;
};
