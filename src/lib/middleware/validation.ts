import { ZodSchema, ZodError } from 'zod';
import { NextResponse } from 'next/server';

export async function validateRequestBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new Error('Invalid JSON payload in request body');
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const customError = new Error(`Validation failed: ${errorDetails.map((d) => `${d.field}: ${d.message}`).join(', ')}`);
    (customError as any).status = 422;
    (customError as any).details = errorDetails;
    throw customError;
  }

  return result.data;
}

export function handleValidationError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input validation failed',
          details,
        },
      },
      { status: 422 }
    );
  }

  const err = error as any;
  if (err.status === 422 && err.details) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
          details: err.details,
        },
      },
      { status: 422 }
    );
  }

  return null;
}
