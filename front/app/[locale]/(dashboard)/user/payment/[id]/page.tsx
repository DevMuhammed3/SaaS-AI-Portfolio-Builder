import PaymentSuccessPage from "@/components/modules/dashboard/user/payment";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment - 10minportfolio",
  description: "View your payment status and details",
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
export default async function page({ params }: Params) {
  const { id } = await params;
  return <PaymentSuccessPage id={id} />;
}
