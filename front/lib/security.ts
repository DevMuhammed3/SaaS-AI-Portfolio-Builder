/**
 * Security utilities for client-side protection
 * Implements input sanitization and validation functions
 */

import { toast } from "sonner";
import { devLog } from "./utils";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param input - Raw HTML string to sanitize
 * @returns Sanitized string safe for display
 */
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "");
}

/**
 * Validates and sanitizes user count to prevent manipulation
 * @param count - User count from API
 * @returns Safe, validated user count
 */
export function validateUserCount(count: unknown): number {
  // Ensure count is a positive number
  const numCount = Number(count);

  if (isNaN(numCount) || numCount < 0) {
    devLog.warn("[Security] Invalid user count received:", count);
    return 0; // Fallback to 0 for invalid counts
  }

  // Cap at reasonable maximum to prevent display issues
  const MAX_DISPLAY_COUNT = 999999;
  return Math.min(numCount, MAX_DISPLAY_COUNT);
}

/**
 * Validates image URLs to prevent malicious content
 * @param url - Image URL to validate
 * @returns Whether the URL is safe to use
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTPS URLs for security
    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Allow common image hosting domains
    const allowedDomains = [
      "images.unsplash.com",
      "plus.unsplash.com",
      "cdn.example.com", // Add your CDN domains here
    ];

    return allowedDomains.some(
      (domain) =>
        parsedUrl.hostname === domain ||
        parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Rate limiting helper for client-side API calls
 * Prevents abuse of API endpoints
 */
export class RateLimiter {
  private calls: number[] = [];

  constructor(
    private maxCalls = 10,
    private windowMs = 60000 // 1 minute
  ) {}

  /**
   * Checks if action is allowed based on rate limit
   * @returns Whether the action should be allowed
   */
  isAllowed(): boolean {
    const now = Date.now();

    // Remove old calls outside the window
    this.calls = this.calls.filter((time) => now - time < this.windowMs);

    // Check if under limit
    if (this.calls.length >= this.maxCalls) {
      devLog.warn("[Security] Rate limit exceeded");
      return false;
    }

    // Record this call
    this.calls.push(now);
    return true;
  }
}

/**
 * SecurityMonitor - singleton for reporting security issues
 */
export class SecurityMonitor {
  private static instance: SecurityMonitor;

  private constructor() {}

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  reportViolation(type: string, details: string): void {
    toast.error(`[SecurityMonitor] Violation detected: ${type}`, {
      description: details,
    });
    // TODO: Send to logging/monitoring service
    // fetch("/api/security/log", { method: "POST", body: JSON.stringify({ type, details }) });
  }
}

/**
 * secureNavigate - safe client navigation
 */
export function secureNavigate(
  path: string,
  router: { push: (url: string) => void }
): boolean {
  try {
    if (!path || typeof path !== "string") {
      devLog.warn("[Security] Invalid navigation path");
      return false;
    }

    // Prevent absolute external redirects
    if (/^https?:\/\//i.test(path)) {
      devLog.warn("[Security] Blocked external navigation:", path);
      return false;
    }

    // Prevent javascript: or data: URLs
    if (/^(javascript:|data:)/i.test(path)) {
      devLog.warn("[Security] Blocked unsafe navigation path:", path);
      return false;
    }

    router.push(path);
    return true;
  } catch (error) {
    devLog.error("[Security] Navigation failed:", error);
    return false;
  }
}
/**
 * SecureRateLimiter - extends RateLimiter with namespace tracking
 */
export class SecureRateLimiter extends RateLimiter {
  private namespace: string;

  constructor(namespace: string, maxCalls = 10, windowMs = 60000) {
    super(maxCalls, windowMs);
    this.namespace = namespace;
  }

  override isAllowed(): boolean {
    const allowed = super.isAllowed();
    if (!allowed) {
      devLog.warn(
        `[Security] Rate limit exceeded in namespace: ${this.namespace}`
      );
    }
    return allowed;
  }
}
