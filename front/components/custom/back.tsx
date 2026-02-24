"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-start space-x-2">
      <button
        onClick={() => router.back()}
        className="text-left font-bold px-4 py-2 rounded dark:text-slate-400 dark:hover:text-white hover:text-primary-500"
        aria-label="Go back"
      >
        ← &nbsp; Back
      </button>
      <button
        onClick={() => router.push("/user")}
        className="text-left font-bold px-4 py-2 rounded dark:text-slate-400 dark:hover:text-white hover:text-primary-500"
        aria-label="Dashboard"
      >
        &nbsp; Dashboard →
      </button>
    </div>
  );
}
