import { AboutPage } from "@/components/modules/pages/about-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function About() {
  return <AboutPage />;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return generateSEOMetadata(
    messages,
    "seo.about.title",
    "seo.about.description",
    locale
  );
}
