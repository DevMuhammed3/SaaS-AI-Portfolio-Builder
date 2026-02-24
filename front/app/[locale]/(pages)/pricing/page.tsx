import { getUserPlan } from "@/actions/user";
import PricingPage from "@/components/modules/pages/pricing-page";
import { generateSEOMetadata, getMessages } from "@/lib/intl";
import { Plan } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function page() {
  const plan = (await getUserPlan()) as Plan;
  return <PricingPage acc={plan} />;
}
export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return generateSEOMetadata(
    messages,
    "seo.pricing.title",
    "seo.pricing.description",
    locale
  );
}
