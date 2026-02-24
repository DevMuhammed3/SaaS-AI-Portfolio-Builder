import { getUserRole } from "@/actions/role";
import { FeaturesPage } from "@/components/modules/pages/features-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";
import type { Role } from "@/types";
import { ErrorBoundary } from "@/components/custom/error-boundary";
import { devLog } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Features Page Server Component
 * Fetches user role and renders the features page with proper error handling
 */
export default async function Features() {
  try {
    const role = (await getUserRole()) as Role;

    return (
      <ErrorBoundary>
        <FeaturesPage role={role} />
      </ErrorBoundary>
    );
  } catch (error) {
    devLog.error("Error loading features page:", error);
    return (
      <ErrorBoundary>
        <FeaturesPage role="user" />
      </ErrorBoundary>
    );
  }
}

/**
 * Generate SEO metadata for the features page
 * Supports internationalization with proper error handling
 */
export async function generateMetadata({ params }: PageProps) {
  try {
    const { locale } = await params;
    const messages = await getMessages(locale);

    return generateSEOMetadata(
      messages,
      "seo.features.title",
      "seo.features.description",
      locale
    );
  } catch (error) {
    devLog.error("Error generating features page metadata:", error);
    return {
      title: "Features",
      description:
        "Discover all the powerful features of our portfolio builder",
    };
  }
}
