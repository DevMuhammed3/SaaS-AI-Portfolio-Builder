/**
 * CSRF Protection Utility
 *
 * Provides CSRF token generation, validation, and middleware for Next.js applications.
 * Uses crypto-secure random tokens with time-based expiration.
 *
 * Features:
 * - Secure token generation using Web Crypto API
 * - Time-based token expiration
 * - Header and form-based token validation
 * - Middleware for automatic protection
 * - TypeScript support with proper error handling
 */

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { devLog } from "@/lib/utils";

// CSRF Configuration
const CSRF_CONFIG = {
  tokenName: "csrf-token",
  cookieName: "__csrf-token",
  headerName: "x-csrf-token",
  tokenLength: 32,
  maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  sameSite: "lax" as const, // when you have dfferent (subdoman) for your app as front.doman.com api.doman.com
  // secure: process.env.NODE_ENV === "production",
  secure: true,
  httpOnly: false,
};

/**
 * Generate a cryptographically secure random token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(CSRF_CONFIG.tokenLength);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Create a timestamped CSRF token
 * Format: {timestamp}.{token}
 */
export function createTimestampedToken(): string {
  const timestamp = Date.now();
  const token = generateCSRFToken();
  return `${timestamp}.${token}`;
}

/**
 * Validate a timestamped CSRF token
 */
export function validateTimestampedToken(token: string): boolean {
  try {
    const [timestampStr, tokenPart] = token.split(".");

    if (!timestampStr || !tokenPart) {
      return false;
    }

    const timestamp = Number.parseInt(timestampStr, 10);
    const now = Date.now();

    // Check if token is expired
    if (now - timestamp > CSRF_CONFIG.maxAge) {
      return false;
    }

    // Validate token format
    if (tokenPart.length !== CSRF_CONFIG.tokenLength * 2) {
      return false;
    }

    return true;
  } catch (error) {
    devLog.error("CSRF token validation error:", error);
    return false;
  }
}

/**
 * Set CSRF token in cookies
 */
export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_CONFIG.cookieName, token, {
    httpOnly: CSRF_CONFIG.httpOnly,
    secure: CSRF_CONFIG.secure,
    sameSite: CSRF_CONFIG.sameSite,
    maxAge: CSRF_CONFIG.maxAge / 1000, // Convert to seconds
    path: "/",
  });
}

/**
 * Get CSRF token from cookies
 */
export async function getCSRFTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CSRF_CONFIG.cookieName);
    return token?.value || null;
  } catch (error) {
    devLog.error("Error getting CSRF token from cookies:", error);
    return null;
  }
}

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromHeaders(request: NextRequest): string | null {
  return request.headers.get(CSRF_CONFIG.headerName) || null;
}

/**
 * Get CSRF token from form data
 */
export async function getCSRFTokenFromForm(
  request: NextRequest
): Promise<string | null> {
  try {
    const formData = await request.formData();
    return formData.get(CSRF_CONFIG.tokenName) as string | null;
  } catch (error) {
    devLog.error("Error getting CSRF token from form:", error);
    return null;
  }
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(
  request: NextRequest
): Promise<boolean> {
  try {
    // Get token from cookies
    const cookieToken = await getCSRFTokenFromCookies();
    if (!cookieToken) {
      console.warn("CSRF: No token found in cookies");
      return false;
    }

    // Get token from headers or form data
    let requestToken = getCSRFTokenFromHeaders(request);

    if (!requestToken && request.method === "POST") {
      // Try to get from form data for POST requests
      const clonedRequest = request.clone() as unknown as NextRequest;
      requestToken = await getCSRFTokenFromForm(clonedRequest);
    }

    if (!requestToken) {
      console.warn("CSRF: No token found in request headers or form data");
      return false;
    }

    // Validate tokens match
    if (cookieToken !== requestToken) {
      console.warn("CSRF: Token mismatch");
      return false;
    }

    // Validate token format and expiration
    if (!validateTimestampedToken(cookieToken)) {
      console.warn("CSRF: Invalid or expired token");
      return false;
    }

    return true;
  } catch (error) {
    devLog.error("CSRF validation error:", error);
    return false;
  }
}

/**
 * CSRF Protection Middleware
 * Use this to protect API routes
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return handler(request);
  }

  // Skip CSRF for webhook endpoints (they should use other authentication)
  const pathname = request.nextUrl.pathname;
  if (
    pathname.includes("/webhooks/") ||
    pathname.includes("/api/webhooks/") ||
    pathname.includes("/api/csrf/") ||
    pathname.includes("/")
  ) {
    return handler(request);
  }

  // Validate CSRF token
  const isValid = await validateCSRFToken(request);

  if (!isValid) {
    console.warn(`CSRF validation failed for ${request.method} ${pathname}`);
    return NextResponse.json(
      {
        error: "CSRF token validation failed",
        message:
          "Invalid or missing CSRF token. Please refresh the page and try again.",
      },
      { status: 403 }
    );
  }

  // Token is valid, proceed with the request
  return handler(request);
}

/**
 * Generate and set new CSRF token
 * Use this in pages or API routes that need to provide tokens
 */
export function generateAndSetCSRFToken(): {
  token: string;
  response: NextResponse;
} {
  const token = createTimestampedToken();
  const response = NextResponse.json({}, { status: 200 });
  setCSRFCookie(response, token);

  return { token, response };
}

/**
 * CSRF Configuration for client-side
 */
export const csrfConfig = {
  tokenName: CSRF_CONFIG.tokenName,
  headerName: CSRF_CONFIG.headerName,
} as const;
