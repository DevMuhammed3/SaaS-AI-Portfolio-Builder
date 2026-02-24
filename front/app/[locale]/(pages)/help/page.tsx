import { HelpPage } from "@/components/modules/pages/help-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return generateSEOMetadata(
    messages,
    "seo.help.title",
    "seo.help.description",
    locale
  );
}
export default function Help() {
  return <HelpPage />;
}
