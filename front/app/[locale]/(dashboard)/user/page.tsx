import type { Metadata } from "next";
import { getMessages, generateSEOMetadata } from "@/lib/intl";
import DashboardContent from "@/components/modules/dashboard/user/dashboard-content";
import { getUserPlan } from "@/actions/user";
import { Plan } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params; // ❌ no "await"
  const messages = await getMessages(locale);

  return generateSEOMetadata(
    messages,
    "seo.dashboard.title",
    "seo.dashboard.description",
    locale
  );
}

export default async function DashboardPage() {
  const plan = (await getUserPlan()) as Plan;
  return <DashboardContent plan={plan} />;
}
