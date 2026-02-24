import { PrivacyPage } from "@/components/modules/pages/privacy-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Privacy() {
  return <PrivacyPage />;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return generateSEOMetadata(
    messages,
    "seo.privacy.title",
    "seo.privacy.description",
    locale
  );
}
