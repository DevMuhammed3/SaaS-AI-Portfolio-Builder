import { TemplatesList } from "@/components/modules/dashboard/admin/templates/templates-list";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

export default function page() {
  return <TemplatesList />;
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Templates  - 10minportfolio`,
    description: `Templates page`,
    icons: {
      icon: `path to asset file`,
    },
  };
}
