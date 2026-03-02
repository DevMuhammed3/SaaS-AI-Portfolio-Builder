"use client";

import { Portfolio } from "@/lib/services/portfolios-service";

export default function MinimalDevTemplate({
  portfolio,
  userRole,
}: {
  portfolio: Portfolio;
  userRole: string;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold p-10">
        {portfolio.profile.name}
      </h1>
    </div>
  );
}
