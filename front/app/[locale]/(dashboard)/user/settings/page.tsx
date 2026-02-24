import { Settings } from "@/components/modules/dashboard/user/settings/settings";

export default async function SettingsPage() {
  return <Settings />;
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Settings - 10minportfolio`,
    description: `Page - Description here`,
    icons: {
      icon: `/images/logo.png`,
    },
  };
}
