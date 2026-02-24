import { auth, clerkClient } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";

/**
 * Middleware-style helper to protect routes and optionally enforce admin-only access.
 *
 * @param options.requireAdmin - If true, the user must have 'admin' role. Defaults to true.
 * @returns The authenticated user context: { userId, sessionId, user }.
 * @throws Throws an error if the user is not authenticated or not authorized.
 */
export async function authGuard({ requireAdmin = true } = {}) {
  try {
    // Retrieve the authenticated user and session
    const { userId, sessionId } = await auth();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Fetch full user details from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // If admin role is required, check private metadata
    if (requireAdmin && user.privateMetadata.role !== "admin") {
      throw new Error("Forbidden");
    }

    // Authorized response
    return { userId, sessionId, user };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      devLog.error("AuthGuard Error:", error);
    }

    // Rethrow so the caller can handle redirect or error response
    throw error;
  }
}
