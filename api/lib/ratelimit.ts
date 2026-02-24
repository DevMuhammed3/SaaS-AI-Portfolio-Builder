// lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  last: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// Config
const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 20; // 20 requests/minute per IP

export async function withRateLimit(
  request: NextRequest,
  next: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };

  // Reset if outside window
  if (now - entry.last > WINDOW) {
    entry.count = 1;
    entry.last = now;
  } else {
    entry.count++;
  }

  rateLimitMap.set(ip, entry);

  const success = entry.count <= LIMIT;

  if (!success) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": Math.max(LIMIT - entry.count, 0).toString(),
          "X-RateLimit-Reset": (entry.last + WINDOW).toString(),
        },
      }
    );
  }

  return next(request);
}
