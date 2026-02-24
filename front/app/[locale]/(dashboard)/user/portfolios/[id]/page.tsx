import type { Metadata } from "next";
import { PortfolioEditor } from "@/components/modules/dashboard/user/portfolios/portfolio-editor";

export const metadata: Metadata = {
  title: "Edit Portfolio - 10minportfolio",
  description: "Edit your portfolio information and content",
  icons: {
    icon: "/images/logo.svg",
  },
};

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * Edit Portfolio Page
 *
 * This page allows users to edit an existing portfolio.
 * It loads the portfolio data and provides a form interface
 * for updating all portfolio sections.
 *
 * Features:
 * - Load existing portfolio data
 * - Edit all portfolio sections
 * - Save changes with validation
 * - Preview functionality
 */
export default async function EditPortfolioPage({ params }: Params) {
  const { id } = await params;
  return <PortfolioEditor portfolioId={id} />;
}

