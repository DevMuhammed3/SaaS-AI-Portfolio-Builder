/**
 * CORS Security Library
 *
 * Provides comprehensive Cross-Origin Resource Sharing (CORS) protection
 * for Next.js API routes with environment-based configuration.
 */

import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";
/**
 * CORS configuration interface
 */
interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
  optionsSuccessStatus: number;
}

/**
 * Default CORS configuration
 */
const DEFAULT_CORS_CONFIG: CORSConfig = {
  allowedOrigins: [],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "Origin",
    "Accept",
    "Cache-Control",
  ],
  allowCredentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

/**
 * Get CORS configuration based on environment
 */
function getCORSConfig(): CORSConfig {
  const config = { ...DEFAULT_CORS_CONFIG };

  // Environment-based origin configuration
  if (process.env.NODE_ENV === "production") {
    // Production: Use environment variable for allowed origins
    const allowedOrigins =
      process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ||
      [];
    config.allowedOrigins = allowedOrigins;
  } else {
    // Development: Allow localhost and common development ports
    config.allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "https://localhost:3000",
      "https://localhost:3001",
    ];
  }

  return config;
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[]
): boolean {
  // If no origin (same-origin request), allow it
  if (!origin) {
    return true;
  }

  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // In development, be more permissive with localhost
  if (process.env.NODE_ENV === "development") {
    const isLocalhost =
      origin.includes("localhost") || origin.includes("127.0.0.1");
    if (isLocalhost) {
      return true;
    }
  }

  return false;
}

/**
 * Set CORS headers on response
 */
function setCORSHeaders(
  response: NextResponse,
  origin: string | null,
  config: CORSConfig
): NextResponse {
  // Determine which origin to allow
  let allowedOrigin = "*";

  if (
    config.allowCredentials &&
    origin &&
    isOriginAllowed(origin, config.allowedOrigins)
  ) {
    allowedOrigin = origin;
  } else if (!config.allowCredentials) {
    allowedOrigin = "*";
  } else {
    // If credentials are required but origin is not allowed, don't set CORS headers
    return response;
  }

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    config.allowedMethods.join(", ")
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    config.allowedHeaders.join(", ")
  );
  response.headers.set("Access-Control-Max-Age", config.maxAge.toString());

  if (config.allowCredentials) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Add Vary header for proper caching
  response.headers.set("Vary", "Origin");

  return response;
}

/**
 * Handle CORS preflight requests (OPTIONS)
 */
function handlePreflightRequest(
  request: NextRequest,
  config: CORSConfig
): NextResponse {
  const origin = request.headers.get("origin");
  const requestMethod = request.headers.get("access-control-request-method");
  const requestHeaders = request.headers.get("access-control-request-headers");

  if (process.env.NODE_ENV === "development") {
    devLog.error("🔍 CORS Preflight Request:", {
      origin,
      requestMethod,
      requestHeaders,
      allowedOrigins: config.allowedOrigins,
    });
  }

  // Check if origin is allowed
  if (!isOriginAllowed(origin, config.allowedOrigins)) {
    if (process.env.NODE_ENV === "development") {
      devLog.warn("CORS: Origin not allowed:", origin);
    }
    return new NextResponse("CORS policy violation", { status: 403 });
  }

  // Check if method is allowed
  if (requestMethod && !config.allowedMethods.includes(requestMethod)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("CORS: Method not allowed:", requestMethod);
    }
    return new NextResponse("Method not allowed", { status: 405 });
  }

  // Create preflight response
  const response = new NextResponse(null, {
    status: config.optionsSuccessStatus,
  });

  // Set CORS headers
  setCORSHeaders(response, origin, config);

  if (process.env.NODE_ENV === "development") {
    devLog.error("CORS Preflight: Request approved");
  }
  return response;
}

/**
 * CORS middleware wrapper for API routes
 */
export function withCORSProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
): Promise<NextResponse> | NextResponse {
  const config = getCORSConfig();
  const origin = request.headers.get("origin");
  const method = request.method;

  if (process.env.NODE_ENV === "development") {
    devLog.error("🔍 CORS Check:", {
      method,
      origin,
      url: request.url,
      allowedOrigins: config.allowedOrigins,
    });
  }

  // Handle preflight requests
  if (method === "OPTIONS") {
    return handlePreflightRequest(request, config);
  }

  // Check origin for actual requests
  if (origin && !isOriginAllowed(origin, config.allowedOrigins)) {
    devLog.warn("CORS: Request blocked - Origin not allowed:", origin);
    return NextResponse.json(
      { error: "CORS policy violation", origin },
      { status: 403 }
    );
  }

  // Execute the handler and add CORS headers to response
  const handlerResult = handler(request);

  // Handle both sync and async responses
  if (handlerResult instanceof Promise) {
    return handlerResult.then((response) => {
      return setCORSHeaders(response, origin, config);
    });
  } else {
    return setCORSHeaders(handlerResult, origin, config);
  }
}

/**
 * Simple CORS headers for manual use
 */
export function getCORSHeaders(origin?: string): Record<string, string> {
  const config = getCORSConfig();
  const headers: Record<string, string> = {};

  // Determine allowed origin
  if (origin && isOriginAllowed(origin, config.allowedOrigins)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else if (!config.allowCredentials) {
    headers["Access-Control-Allow-Origin"] = "*";
  }

  headers["Access-Control-Allow-Methods"] = config.allowedMethods.join(", ");
  headers["Access-Control-Allow-Headers"] = config.allowedHeaders.join(", ");
  headers["Access-Control-Max-Age"] = config.maxAge.toString();
  headers["Vary"] = "Origin";

  if (config.allowCredentials) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

/**
 * Validate CORS configuration
 */
export function validateCORSConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getCORSConfig();

  // Check if origins are configured in production
  if (
    process.env.NODE_ENV === "production" &&
    config.allowedOrigins.length === 0
  ) {
    errors.push("No allowed origins configured for production environment");
  }

  // Validate origin format
  config.allowedOrigins.forEach((origin) => {
    try {
      new URL(origin);
    } catch {
      errors.push(`Invalid origin format: ${origin}`);
    }
  });

  // Check for wildcard with credentials
  if (config.allowCredentials && config.allowedOrigins.includes("*")) {
    errors.push("Cannot use wildcard origin (*) with credentials enabled");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log CORS configuration for debugging
 */
export function logCORSConfig(): void {
  const config = getCORSConfig();
  const validation = validateCORSConfig();

  if (process.env.NODE_ENV === "development") {
    devLog.error("CORS Configuration:", {
      environment: process.env.NODE_ENV,
      allowedOrigins: config.allowedOrigins,
      allowedMethods: config.allowedMethods,
      allowCredentials: config.allowCredentials,
      maxAge: config.maxAge,
      validation: validation.valid ? "✅ Valid" : "❌ Invalid",
      errors: validation.errors,
    });
  }
}

// Log configuration on module load
if (process.env.NODE_ENV === "development") {
  logCORSConfig();
}
