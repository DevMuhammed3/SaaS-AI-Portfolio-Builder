// import { apiClient } from "@/lib/api-client";
// import { Portfolio } from "@/lib/services/portfolios-service";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://10minportfolio.app";

  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/public-portfolios`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Dynamic portfolio pages
  const portfolioPages: MetadataRoute.Sitemap = [];

  // try {
  //   // Fetch public portfolios for sitemap
  //   const response = await apiClient.get(apiUrl + "/api/public/portfolio", {
  //     params: { limit: 1000, plan: "premium" },
  //   });

  //   const data = response.data.portfolios;

  //   portfolioPages = data.portfolios.map((portfolio: Portfolio) => ({
  //     url: `${baseUrl}/${portfolio.slug}`,
  //     lastModified: new Date(portfolio.updatedAt),
  //     changeFrequency: "weekly" as const,
  //     priority: 0.6,
  //   }));
  // } catch (error) {
  //   devLog.error("Error fetching portfolios for sitemap:", error);
  // }

  return [...staticPages, ...portfolioPages];
}
