import { NextResponse } from "next/server";
import { getPaymentRequestDetail } from "@/server/services/payment-request.service";
import { toRouteErrorResponse } from "@/server/utils/route-error";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await getPaymentRequestDetail(id);
    return NextResponse.json(result);
  } catch (error) {
    return toRouteErrorResponse(error);
  }
}
