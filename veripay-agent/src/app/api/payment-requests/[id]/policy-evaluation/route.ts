import { NextResponse } from "next/server";
import { evaluatePaymentRequestPolicy } from "@/server/services/payment-request.service";
import { toRouteErrorResponse } from "@/server/utils/route-error";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await evaluatePaymentRequestPolicy(id);
    return NextResponse.json(result);
  } catch (error) {
    return toRouteErrorResponse(error);
  }
}
