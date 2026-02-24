import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { withCSRFProtection } from "@/lib/csrf";
import { withCORSProtection } from "@/lib/cors";

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const response = NextResponse.next();
  const clerk = await clerkClient();
  const pathname = request.nextUrl.pathname;
  const { userId } = await auth();

  // Api that do not require any guard
  if (request.nextUrl.pathname === "/api/csrf" || pathname.startsWith("/")) {
    return NextResponse.next(); // Allow without CSRF check
  }

  // Apply CORS to all API routes first
  if (pathname.startsWith("/api/")) {
    return withCORSProtection(request, async (request) => {
      // Then apply CSRF protection
      return withCSRFProtection(request, async () => {
        // Continue to the API route
        return response;
      });
    });
  }

  // Api that do require auth token authentification
  if (
    !pathname.startsWith("/api/install") ||
    !pathname.startsWith("/api/public") ||
    !pathname.startsWith("/api/webhooks") || //nextjs vercel webhooks only
    !pathname.startsWith("/") ||
    !pathname.startsWith("/api-docs")
  ) {
    if (!userId) {
      return NextResponse.json(
        { error: "You are not connected" },
        { status: 401 }
      );
    }
    return response;
  }

  // Api that do require authorization (admin role)
  if (userId && pathname.startsWith("/api/admin")) {
    if (!userId) {
      return NextResponse.json(
        { error: "You are not connected" },
        { status: 401 }
      );
    }
    const user = await clerk.users.getUser(userId);

    if (user.privateMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return response;
  }
  // For all other requests (non-API), just continue
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
