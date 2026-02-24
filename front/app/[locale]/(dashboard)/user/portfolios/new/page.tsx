import { getUserPlan } from "@/actions/user";
import { PortfolioWizard } from "@/components/modules/dashboard/user/portfolios/portfolio-wizard";
import { Plan } from "@/types";

/**
 * Create New Portfolio Page
 *
 * This page contains the portfolio creation wizard that guides users
 * through the process of creating a new portfolio step by step.
 *
 * Wizard Steps:
 * 1. Template Selection
 * 2. Profile Information
 * 3. Skills & Certifications
 * 4. Work Experience
 * 5. Projects
 * 6. Finalization & Review
 */
export default async function NewPortfolioPage() {
  const plan = (await getUserPlan()) as Plan;
  return <PortfolioWizard plan={plan} />;
}
// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Add Portfolio - 10minportfolio`,
    description: `Portfolios - 10minportfolio`,
    icons: {
      icon: "/images/logo.svg",
    },
  };
}
