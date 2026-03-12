import { NextResponse } from "next/server";
import { createPaymentRequest } from "@/server/services/payment-request.service";
import { createPaymentRequestInputSchema } from "@/server/validators/payment-intent";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = createPaymentRequestInputSchema.parse(json);
    const result = await createPaymentRequest(input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Request payload could not be validated.",
            details: (error as { issues: unknown }).issues,
          },
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while creating payment request.";

    const code =
      message.includes("GEMINI_API_KEY") || message.includes("Gemini")
        ? "AI_PROVIDER_ERROR"
        : "INTERNAL_SERVER_ERROR";

    return NextResponse.json(
      {
        error: {
          code,
          message,
        },
      },
      { status: 500 },
    );
  }
}
