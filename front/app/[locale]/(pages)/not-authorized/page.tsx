import BackButton from "@/components/custom/back";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

export default function NotAuthorized() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        403 - Not Authorized
      </h1>
      <p className="text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <BackButton />
    </div>
  );
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Not authorized`,
    description: `Page - Description here`,
    icons: {
      icon: `path to asset file`,
    },
  };
}
