"use server"; // Ensures this code always runs on the server (not the browser)

import type { Plan } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";
import { cache } from "react";

// Cache settings
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
// Our in-memory cache (resets when server restarts)
const userCache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * Validate that a given userId is in the correct Clerk format.
 * Example of valid format: "user_xxxxxxxxxxxxxxxxxxxxxxxx"
 */
function validateUserId(userId: string | null): userId is string {
  return typeof userId === "string" && /^user_[a-zA-Z0-9]+$/.test(userId);
}

/**
 * Get data from cache if it exists and is still fresh (not expired).
 * If not found or expired, return null.
 */
function getCachedData<T>(key: string): T | null {
  const cached = userCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

/**
 * Save data to cache with the current timestamp.
 */
function setCachedData<T>(key: string, data: T): void {
  userCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Get the role of the current user.
 * - Tries cache first
 * - Falls back to Clerk API if cache is empty or expired
 */
export const getUserRole = cache(async function getUserRole(): Promise<string> {
  try {
    const { userId } = await auth(); // Get the currently logged-in user's ID

    // If the userId is missing or invalid, default to "user"
    if (!validateUserId(userId)) {
      devLog.warn("Invalid or missing userId in getUserRole");
      return "user";
    }

    const cacheKey = `role_${userId}`;
    const cached = getCachedData<string>(cacheKey);
    if (cached !== null) {
      return cached; // Return cached role
    }

    // Fetch from Clerk if not cached
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Read role from Clerk metadata
    const role = user.privateMetadata?.role;
    const validRole =
      typeof role === "string" && ["user", "admin", "moderator"].includes(role)
        ? role
        : "user"; // Default to "user" if invalid

    // Save to cache
    setCachedData(cacheKey, validRole);

    return validRole;
  } catch (error) {
    // Log error and safely fallback
    devLog.error("Error getting user role:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return "user";
  }
});

/**
 * Get the subscription plan of the current user.
 * - Checks cache first
 * - If missing, asks Clerk
 */
export const getUserPlan = cache(async function getUserPlan(): Promise<Plan> {
  try {
    const { userId } = await auth();

    if (!validateUserId(userId)) {
      devLog.warn("Invalid or missing userId in getUserPlan");
      return "free"; // Default to free plan
    }

    const cacheKey = `plan_${userId}`;
    const cached = getCachedData<string>(cacheKey) as Plan;
    if (cached !== null) {
      return cached; // Return cached plan
    }

    // Fetch from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Validate and return plan
    const plan = user.privateMetadata?.plan;
    const validPlans: Plan[] = ["free", "premium"]; // Allowed values
    const validPlan =
      typeof plan === "string" && validPlans.includes(plan as Plan)
        ? (plan as Plan)
        : "free";

    // Save to cache
    setCachedData(cacheKey, validPlan);

    return validPlan;
  } catch (error) {
    devLog.error("Error getting user plan:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return "free";
  }
});

/**
 * Count total users in the system.
 * - Uses cache to avoid hitting Clerk API too often
 * - Calls Clerk only if cache is empty/expired
 */
export const countUsers = cache(async function countUsers(): Promise<number> {
  try {
    const cacheKey = "user_count";
    const cached = getCachedData<number>(cacheKey);
    if (cached !== null) {
      return cached; // Return cached user count
    }

    // Ask Clerk for the user list (only need totalCount, so limit = 1)
    const clerk = await clerkClient();

    const users = await Promise.race([
      clerk.users.getUserList({ limit: 1 }),
      new Promise<never>(
        (_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000) // Prevent hanging
      ),
    ]);

    const count = users.totalCount;

    // Save to cache
    setCachedData(cacheKey, count);

    return count;
  } catch (error) {
    devLog.error("Error counting users:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return 0; // Safe fallback
  }
});

/**
 * Clear cache:
 * - If a userId is provided → clear only that user's role & plan
 * - Otherwise → clear everything
 */
export async function clearUserCache(userId?: string): Promise<void> {
  if (userId) {
    userCache.delete(`role_${userId}`);
    userCache.delete(`plan_${userId}`);
  } else {
    userCache.clear();
  }
}
