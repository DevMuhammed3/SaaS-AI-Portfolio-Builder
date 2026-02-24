import { notFound } from "next/navigation";
import { PortfolioPreview } from "@/components/modules/portfolio/portfolio-preview";
import { Portfolio } from "@/lib/services/portfolios-service";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { getAllPortfolioSlugs } from "@/actions/portfolio";
import { devLog } from "@/lib/utils";

export const revalidate = 300; // 5 minutes
export const dynamicParams = true; // Enable dynamic params for this page
// export const dynamic = "force-dynamic";

async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await apiClient.get(
      `${baseUrl}/api/public/portfolio/${slug}`
    );

    return response.data.portfolio || null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      devLog.error("Axios error:", error.response?.data || error.message);
    } else {
      devLog.error("Unexpected error:", error);
    }
    return null;
  }
}

interface PortfolioPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPortfolioSlugs();
  if (!slugs) {
    return [];
  }
  return slugs.map((slug: string) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    return {
      title: "Free Developer Portfolio Builder - 10minportfolio",
      description:
        "Build your professional portfolio in minutes. No code required, SEO optimized.",
    };
  }

  return {
    title: `${portfolio.profile.name} - ${portfolio.profile.title}`,
    description:
      portfolio.profile.bio || `Portfolio of ${portfolio.profile.name}`,

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SERVER_URL}/portfolio/${slug}`,
    },
    openGraph: {
      title: `${portfolio.profile.name} - ${portfolio.profile.title}`,
      description:
        portfolio.profile.bio || `Portfolio of ${portfolio.profile.name}`,
      images: portfolio.profile.profilePhoto
        ? [portfolio.profile.profilePhoto]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${portfolio.profile.name} - ${portfolio.profile.title}`,
      description:
        portfolio.profile.bio || `Portfolio of ${portfolio.profile.name}`,
      images: portfolio.profile.profilePhoto
        ? [portfolio.profile.profilePhoto]
        : [],
    },
    icons: {
      icon: `/images/logo.png`,
    },
    other: {
      "script:type": "application/ld+json",
      "script:innerHTML": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: portfolio.profile.name,
        jobTitle: portfolio.profile.title,
        description: portfolio.profile.bio,
        image: portfolio.profile.profilePhoto,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${slug}`,
      }),
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;

  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  // For now, we'll assume all users are free tier
  // In a real app, you'd get this from authentication/session
  const userRole = "premium";

  return (
    <div className="min-h-screen">
      <PortfolioPreview portfolio={portfolio} userRole={userRole} />
    </div>
  );
}
