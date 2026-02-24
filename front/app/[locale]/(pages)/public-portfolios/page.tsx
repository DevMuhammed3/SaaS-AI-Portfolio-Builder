import { PublicPortfoliosPage } from "@/components/modules/pages/public-portfolios-page";
import { ErrorBoundary } from "@/components/custom/error-boundary";
import { getMessages, generateSEOMetadata } from "@/lib/intl";
import { devLog } from "@/lib/utils";
import type { SEOMetadata } from "@/types/landing";

export const revalidate = 300; // 5 minutes

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Generates SEO metadata for the Public Portfolios page
 * Ensures i18n support and fallback metadata if loading fails
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<SEOMetadata> {
  const { locale } = await params;

  try {
    const messages = await getMessages(locale);
    return generateSEOMetadata(
      messages,
      "seo.publicportfolios.title",
      "seo.publicportfolios.description",
      locale
    );
  } catch (error) {
    devLog.error("[PublicPortfolios] Failed to generate metadata:", error);

    // Fallback metadata
    return {
      title: "Public Portfolios - Explore Developer Work",
      description:
        "Browse and get inspired by public portfolios built with 10minPortfolio. Discover designs and ideas from the community.",
      locale: locale || "en",
    };
  }
}

/**
 * Public Portfolios Page
 * Wraps main content with error boundaries to ensure resilience
 */
export default function PublicPortfolios() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Public Portfolios</h1>
            <p className="text-muted-foreground">
              The portfolio gallery is temporarily unavailable. Please try again
              later.
            </p>
          </div>
        </div>
      }
    >
      <PublicPortfoliosPage />
    </ErrorBoundary>
  );
}
