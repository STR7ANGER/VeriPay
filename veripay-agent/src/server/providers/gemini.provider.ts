type GeminiExtractionResponse = {
  recipientAddress: string;
  amountEth: string;
  tokenSymbol: string;
  reason: string;
  confidenceScore: number;
  explanation: string;
};

export async function extractPaymentIntentWithGemini(input: {
  rawPrompt: string;
  walletAddress?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: [
                  "You are an extraction service for a crypto payment app.",
                  "Return JSON only.",
                  "Infer a single ETH payment on Base Sepolia from the prompt.",
                  "Do not invent fields outside the schema.",
                  "If data is missing, make the best safe extraction and explain uncertainty.",
                  `Wallet address: ${input.walletAddress ?? "unknown"}`,
                  `Prompt: ${input.rawPrompt}`,
                  'Schema: {"recipientAddress":"0x...","amountEth":"0.001","tokenSymbol":"ETH","reason":"string","confidenceScore":0.8,"explanation":"string"}',
                ].join("\n"),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${errorText}`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini did not return structured content.");
  }

  try {
    return JSON.parse(text) as GeminiExtractionResponse;
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}
