import { devLog } from "@/lib/utils";
import { SEOMetadata } from "@/types/landing";

export async function getMessages(locale: string) {
  try {
    const messages = await import(`@/public/locales/messages/${locale}.ts`);
    return messages.default;
  } catch (error) {
    // Fallback to English if locale not found
    const messages = await import(`@/public/locales/messages/en.ts`);
    return messages.default;
    devLog.warn(error);
  }
}

export function generateSEOMetadata(
  messages: Record<string, string>,
  titleKey: string,
  descriptionKey: string,
  locale = "en"
): SEOMetadata {
  return {
    title: messages[titleKey],
    description: messages[descriptionKey],
    locale,
    siteName: "10minportfolio",
    keywords: [
      "10minportfolio",
      "portfolio builder",
      "developer portfolio",
      "build portfolio",
      "portfolio",
    ],
    openGraph: {
      title: messages[titleKey],
      description: messages[descriptionKey],
      type: "website",
      locale,
      url: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/images/social-card.png`,
          width: 1200,
          height: 630,
          alt: messages[titleKey],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages[titleKey],
      description: messages[descriptionKey],
      images: [`${process.env.NEXT_PUBLIC_SERVER_URL}/images/social-card.png`],
    },
    icons: {
      icon: "/images/logo.svg",
    },
    alternates: {
      languages: {
        en: "/en",
        fr: "/fr",
        [locale]: `/${locale}`,
      },
    },
  };
}
