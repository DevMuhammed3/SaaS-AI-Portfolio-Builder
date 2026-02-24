import { DashboardAdmin } from "@/components/modules/dashboard/admin/dashboard-admin";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

export default function page() {
  return <DashboardAdmin />;
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Admin  - 10minportfolio`,
    description: `Admin page`,
    icons: {
      icon: `path to asset file`,
    },
  };
}
