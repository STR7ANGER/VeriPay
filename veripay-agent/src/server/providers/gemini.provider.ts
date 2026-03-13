type GeminiExtractionResponse = {
  recipient: string;
  amountEth: string;
  reason: string;
  confidenceScore: number;
  explanation: string;
};

export async function extractPaymentIntentWithGemini(input: {
  rawPrompt: string;
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
                  "You are an extraction service for VeriPay Agent.",
                  "Return JSON only.",
                  "Infer a single ETH transfer intent from the prompt.",
                  "The recipient may be an EVM address, ENS name, or social handle.",
                  "Do not invent fields outside the schema.",
                  "If data is missing, make the best safe extraction and explain uncertainty.",
                  `Prompt: ${input.rawPrompt}`,
                  'Schema: {"recipient":"0x... or vitalik.eth or @username","amountEth":"0.001","reason":"string","confidenceScore":0.8,"explanation":"string"}',
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
