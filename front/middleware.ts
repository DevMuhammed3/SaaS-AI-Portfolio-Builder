import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n-config";
const { locales, defaultLocale } = i18n;

function getLocale(request: NextRequest): string {
  try {
    const localesString: string[] = locales.map((item) => item.lang);

    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();

    // If no valid languages are detected, fallback
    if (!languages || languages.length === 0) {
      console.warn(
        "No Accept-Language header or invalid — falling back to defaultLocale"
      );
      return defaultLocale;
    }

    const selectedLocale = match(languages, localesString, defaultLocale);
    return selectedLocale || defaultLocale;
  } catch (error) {
    console.error("Error detecting locale:", error);
    return defaultLocale;
  }
}

/**Clerk middleware */
const isAuthRoute = createRouteMatcher([
  "/user(.*)",
  "/public-portfolios(.*)",
  "/checkout(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (isAuthRoute(request) && !userId)
    return NextResponse.redirect(new URL("/", request.url));

  // Protect admin routes
  if (isAdminRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Fetch full user object from Clerk using the userId
    const user = await clerk.users.getUser(userId);

    // Safely access the subscription stored in user's private metadata
    const role = user.privateMetadata?.role as string;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/not-authorized", request.url));
    }
  }

  //Rewrite URL for locale
  let response, nextLocale;

  const { basePath, pathname } = request.nextUrl;

  // Redirect if there is no locale
  const pathLocale = locales.find(
    (locale) =>
      pathname.startsWith(`/${locale.lang}/`) || pathname === `/${locale.lang}`
  );

  // a local is found
  if (pathLocale) {
    const isDefaultLocale = pathLocale.lang === defaultLocale;
    if (isDefaultLocale) {
      let pathWithoutLocale =
        pathname.slice(`/${pathLocale.lang}`.length) || "/";
      if (request.nextUrl.search) pathWithoutLocale += request.nextUrl.search;
      const url = basePath + pathWithoutLocale;
      response = NextResponse.redirect(new URL(url, request.url));
    }
    nextLocale = pathLocale.lang;
  }

  // a local is not found cause either is hidden for default or user is new to website
  else {
    const hasLocale = request.cookies.has("NEXT_LOCALE");
    const locale = hasLocale ? defaultLocale : getLocale(request);
    let newPath = `/${locale}${pathname}`;
    if (request.nextUrl.search) newPath += request.nextUrl.search;
    const url = basePath + newPath;
    response =
      locale === defaultLocale
        ? NextResponse.rewrite(new URL(url, request.url))
        : NextResponse.redirect(new URL(url, request.url));
    nextLocale = locale;
  }

  if (!response) response = NextResponse.next();
  if (nextLocale) response.cookies.set("NEXT_LOCALE", nextLocale);
  return response;
});

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - Static files (e.g. .css, .js, .png)
     * - API routes
     * - Next.js internal files (_next)
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};
