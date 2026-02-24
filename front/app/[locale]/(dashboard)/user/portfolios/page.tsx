import { PortfoliosList } from "@/components/modules/dashboard/user/portfolios/portfolios-list";

/**
 * User Portfolios Page
 *
 * This page displays all portfolios created by the authenticated user.
 * Users can view, edit, delete, and create new portfolios from this page.
 *
 * Features:
 * - List all user portfolios
 * - Create new portfolio button
 * - Portfolio management actions
 * - Responsive grid layout
 */
export default function PortfoliosPage() {
  return <PortfoliosList />;
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Portfolios -10minportfolio`,
    description: `Portfolios -10minportfolio`,
    icons: {
      icon: `path to asset file`,
    },
  };
}
