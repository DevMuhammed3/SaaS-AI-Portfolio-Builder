import { Suspense } from "react";
import dynamic from "next/dynamic";
import { countUsers } from "@/actions/user";
import { ErrorBoundary } from "@/components/custom/error-boundary";
import { getMessages, generateSEOMetadata } from "@/lib/intl";
import { validateUserCount } from "@/lib/security";
import type { SEOMetadata } from "@/types/landing";
import { devLog } from "@/lib/utils";
import StoryClient from "@/components/story-client"

// Nextjs ISR caching strategy
export const revalidate = 86400; //24 hours

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Generates SEO metadata for the landing page
 * Ensures proper internationalization and SEO optimization
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<SEOMetadata> {
  const { locale } = await params;

  try {
    const messages = await getMessages(locale);
    return generateSEOMetadata(
      messages,
      "seo.home.title",
      "seo.home.description",
      locale
    );
  } catch (error) {
    devLog.error("[Landing] Failed to generate metadata:", error);

    return {
      title: "Portfolio Builder - Create Your Portfolio in 10 Minutes",
      description:
        "Build professional portfolios quickly without coding. Join thousands of users creating stunning portfolios.",
      locale: locale || "en",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Dynamic Lazy-Loaded Components with Streaming Support            */
/* ------------------------------------------------------------------ */

const Header = dynamic(() => import("@/components/modules/landing/header"), {
  ssr: true,
  loading: () => (
    <div className="h-20 bg-background border-b flex items-center justify-center">
      <span className="text-muted-foreground">Loading header...</span>
    </div>
  ),
});

const Hero = dynamic(() => import("@/components/modules/landing/hero"), {
  ssr: true,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Loading hero...</p>
    </div>
  ),
});

// const Story = dynamic(() => import("@/components/modules/landing/story"), {
//   ssr: false, // client-only component (if it uses browser APIs like YouTube)
//   loading: () => (
//     <div className="flex-1 flex items-center justify-center">
//       <p className="text-muted-foreground">Loading story...</p>
//     </div>
//   ),
// });

const Footer = dynamic(() => import("@/components/modules/landing/footer"), {
  ssr: true,
  loading: () => (
    <div className="py-8 border-t bg-muted/50 text-center">
      <span className="text-muted-foreground">Loading footer...</span>
    </div>
  ),
});

/* ------------------------------------------------------------------ */
/*  Landing Page with Lazy Loading + React Streaming Suspense       */
/* ------------------------------------------------------------------ */

export default async function LandingPage() {
  let usersCount = 0;

  try {
    const rawUsersCount = 1000;
    usersCount = validateUserCount(rawUsersCount);
  } catch (error) {
    devLog.error("[Landing] Failed to fetch user count:", error);
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col">
        {/*  Header Stream */}
        <Suspense
          fallback={
            <div className="h-20 bg-background border-b flex items-center justify-center">
              <span className="text-muted-foreground">Loading header...</span>
            </div>
          }
        >
          <Header />
        </Suspense>

        {/*  Hero Section Stream */}
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Portfolio Builder</h1>
                <p className="text-muted-foreground">
                  Create your portfolio in minutes...
                </p>
              </div>
            </div>
          }
        >
          <Hero usersCount={usersCount} />
        </Suspense>

        {/*  Story Section Stream */}
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Loading story section...</p>
            </div>
          }
        >
        </Suspense>

        {/*  Footer Stream */}
        <Suspense
          fallback={
            <div className="py-8 border-t bg-muted/50 text-center">
              <span className="text-muted-foreground">Loading footer...</span>
            </div>
          }
        >
          <Footer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
