import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};

export function ok<T>(data: T, message = "OK", status = 200) {
  return NextResponse.json(
    { success: true, message, data } satisfies ApiSuccess<T>,
    { status }
  );
}

export function fail(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message } satisfies ApiError,
    { status }
  );
}

export function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}
