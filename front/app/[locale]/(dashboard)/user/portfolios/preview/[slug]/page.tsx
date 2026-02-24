import { notFound } from "next/navigation";
import { PortfolioPreview } from "@/components/modules/portfolio/portfolio-preview";
import { Portfolio } from "@/lib/services/portfolios-service";
import axios from "axios";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";
import { devLog } from "@/lib/utils";

export const revalidate = 300; // 5 minutes
export const dynamicParams = true; // Enable dynamic params for this page

async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token && token.trim() !== "") {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiClient.get(
      `${baseUrl}/api/user/portfolios/preview/${slug}`,
      { headers }
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

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Review - 10minportfolio`,
    description: `Review - 10minportfolio`,
    icons: {
      icon: `/images/logo.png`,
    },
  };
}
