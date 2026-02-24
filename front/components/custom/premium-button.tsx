"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PremiumButton() {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-10 p-4 text-center space-y-2">
      <Lock className="w-8 h-8 text-slate-700 mb-1" />

      <p className="text-sm text-slate-700 font-medium">
        This section is for
        <span className="font-semibold text-slate-900">Premium Users</span>
      </p>
      <Link
        href="/checkout"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-md transition"
      >
        Unlock Premium Access
      </Link>
    </div>
  );
}
