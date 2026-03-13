import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/server/errors/app-error";

export function toRouteErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request payload could not be validated.",
          details: error.issues,
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while handling the request.",
      },
    },
    { status: 500 },
  );
}
