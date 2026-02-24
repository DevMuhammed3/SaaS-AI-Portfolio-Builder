import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://10minportfolio.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/features",
          "/pricing",
          "/public-portfolios",
          "/help",
          "/privacy",
        ],
        disallow: ["/admin/*", "/user/*", "/api/*", "/_next/*", "/static/*"],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about",
          "/features",
          "/pricing",
          "/public-portfolios",
          "/help",
          "/privacy",
        ],
        disallow: ["/admin/*", "/user/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
