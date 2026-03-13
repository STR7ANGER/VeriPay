import { NextResponse } from "next/server";
import { executePaymentRequest } from "@/server/services/payment-request.service";
import { executePaymentRequestInputSchema } from "@/server/validators/payment-intent";
import { toRouteErrorResponse } from "@/server/utils/route-error";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const input = executePaymentRequestInputSchema.parse(json);
    const result = await executePaymentRequest(id, input);
    return NextResponse.json(result);
  } catch (error) {
    return toRouteErrorResponse(error);
  }
}
