import { AppError } from "@/server/errors/app-error";

type SubmitTxInput = {
  to: string;
  value: string;
  chainId: number;
  description: string;
  waitForConfirmation: boolean;
};

export type BankrSubmitResponse = {
  success?: boolean;
  transactionHash?: string;
  status?: "success" | "reverted" | "pending";
  blockNumber?: string;
  gasUsed?: string;
  signer?: string;
  chainId?: number;
};

export async function submitTransferWithBankr(input: SubmitTxInput) {
  const apiKey = process.env.BANKR_API_KEY;
  const baseUrl = process.env.BANKR_BASE_URL ?? "https://api.bankr.bot";

  if (!apiKey) {
    throw new AppError("BANKR_API_KEY is required for live execution.", {
      code: "BANKR_NOT_CONFIGURED",
      statusCode: 400,
    });
  }

  const response = await fetch(`${baseUrl}/agent/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      transaction: {
        to: input.to,
        value: input.value,
        chainId: input.chainId,
      },
      description: input.description,
      waitForConfirmation: input.waitForConfirmation,
    }),
  });

  const text = await response.text();
  let parsed: BankrSubmitResponse = {};

  if (text) {
    try {
      parsed = JSON.parse(text) as BankrSubmitResponse;
    } catch {
      parsed = {};
    }
  }

  if (!response.ok) {
    throw new AppError("Bankr execution failed.", {
      code: "BANKR_EXECUTION_FAILED",
      statusCode: response.status,
      details: parsed,
    });
  }

  return parsed;
}
