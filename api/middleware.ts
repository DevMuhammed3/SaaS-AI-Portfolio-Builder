import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { withCORSProtection } from "@/lib/cors";

export default clerkMiddleware(async (_auth, request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  // Apply CORS only to API routes
  if (pathname.startsWith("/api/")) {
    return withCORSProtection(request, async () => {

      // Handle preflight requests
      if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 200 });
      }

      // Continue to API route
      return NextResponse.next();
    });
  }

  // Non-API requests continue normally
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
