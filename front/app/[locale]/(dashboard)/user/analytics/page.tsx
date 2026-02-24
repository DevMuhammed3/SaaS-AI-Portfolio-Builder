import AnalyticsContent from "@/components/modules/dashboard/user/analytic";
import { getUserPlan } from "@/actions/user";
import { Plan } from "@/types";

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Portfolios Analytics - 10min portfolio`,
    description: `Portfolios Analytics - 10min portfolio`,
    icons: {
      icon: `/images/logo.png`,
    },
  };
}

export default async function page() {
  const plan = (await getUserPlan()) as Plan;
  return <AnalyticsContent plan={plan} />;
}
