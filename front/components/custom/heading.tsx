"use client";

import { useRouter } from "next/navigation";

interface HeaderWithBackProps {
  title: string;
  description: string;
}

export default function Heading({ title, description }: HeaderWithBackProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between space-y-10">
      <div className="flex items-center justify-start space-x-2">
        <button
          onClick={() => router.back()}
          className="text-left px-4 py-2 rounded hover:text-primary-500 font-thin"
          aria-label="Go back"
        >
          ← &nbsp; Back
        </button>
        <button
          onClick={() => router.push("/user")}
          className="text-left px-4 py-2 rounded hover:text-primary-500 font-thin"
          aria-label="Dashboard"
        >
          &nbsp; Dashboard →
        </button>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
