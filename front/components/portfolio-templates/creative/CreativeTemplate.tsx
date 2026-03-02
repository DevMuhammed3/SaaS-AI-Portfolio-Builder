"use client";

import { Portfolio } from "@/lib/services/portfolios-service";

export default function CreativeTemplate({
  portfolio,
}: {
  portfolio: Portfolio;
}) {
  return (
    <div className="min-h-screen bg-yellow-500 text-black p-20">
      <h1 className="text-6xl font-bold">
        {portfolio.profile.name}
      </h1>
      <p className="mt-6 text-xl">
        {portfolio.profile.title}
      </p>
    </div>
  );
}
