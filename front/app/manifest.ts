import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "10minportfolio - Create Professional Portfolios",
    short_name: "10minportfolio",
    description:
      "Create stunning professional portfolios with our easy-to-use builder. Multiple templates, custom domains, and advanced features.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff2dbd",
    orientation: "portrait-primary",
    categories: ["productivity", "business", "portfolio"],
    lang: "en",
    icons: [
      {
        src: "/images/login.svg",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/login.svg",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
