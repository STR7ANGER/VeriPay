import { NextResponse } from "next/server";
import { createPaymentRequest } from "@/server/services/payment-request.service";
import { createPaymentRequestInputSchema } from "@/server/validators/payment-intent";
import { toRouteErrorResponse } from "@/server/utils/route-error";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = createPaymentRequestInputSchema.parse(json);
    const result = await createPaymentRequest(input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toRouteErrorResponse(error);
  }
}
