import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Next.js Full-Stack Boilerplate
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          A scalable, production-ready starter template built with Next.js 15,
          TypeScript, MongoDB, Clerk, Tailwind, and more.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/api-docs" target="_blank">
            <Button size="lg" className="w-48">
              API Docs
            </Button>
          </Link>
          <Link
            href="https://github.com/sylvaincodes/nextjs-fullstack-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-48">
              GitHub Repo
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://www.patreon.com/c/sylvaincodes"
            className="underline"
          >
            SylvainCodes
          </a>
          . MIT Licensed.
        </div>
      </div>
    </main>
  );
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Full Stack Nextjs Boilerplate`,
    description: `Full Stack Nextjs Boilerplate`,
    icons: {
      icon: `🚀​`,
    },
  };
}
