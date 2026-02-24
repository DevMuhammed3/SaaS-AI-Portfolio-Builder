import Link from "next/link";
import React from "react";

// Nextjs ISR caching strategy
export const revalidate = false;

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
export default function page() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-900">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
        🔧 Tech Stack Overview
      </h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Frontend Stack</h2>
        <ul className="space-y-4 text-base leading-relaxed text-gray-700">
          <li>
            <strong>Next.js 15</strong> – React framework using the App Router
            and Server Actions for full-stack development.
          </li>
          <li>
            <strong>React 19</strong> – Latest React version with concurrent
            features, server components, and transitions.
          </li>
          <li>
            <strong>TypeScript</strong> – Strong typing and autocompletion for
            better DX and safety.
          </li>
          <li>
            <strong>Tailwind CSS v4</strong> – Utility-first styling framework
            for rapid UI development.
          </li>
          <li>
            <strong>shadcn/ui</strong> – Modern component library based on Radix
            UI + Tailwind CSS.
          </li>
          <li>
            <strong>Framer Motion</strong> – Smooth animations and transitions.
          </li>
          <li>
            <strong>Redux Toolkit</strong> – Centralized state management using
            slices and thunks.
          </li>
          <li>
            <strong>React Hook Form</strong> – Simple and performant form
            handling.
          </li>
          <li>
            <strong>React Intl</strong> – Internationalization (i18n) for
            multilingual UI.
          </li>
          <li>
            <strong>Clerk</strong> – Authentication, user profiles, and access
            control.
          </li>
          <li>
            <strong>Stripe</strong> – Secure payments, subscriptions, and
            webhook handling.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Backend Stack</h2>
        <ul className="space-y-4 text-base leading-relaxed text-gray-700">
          <li>
            <strong>Next.js API Routes</strong> – Built-in backend with RESTful
            and serverless endpoints.
          </li>
          <li>
            <strong>MongoDB</strong> – NoSQL document database used for storing
            user data, courses, payments, etc.
          </li>
          <li>
            <strong>Mongoose</strong> – ODM for modeling and querying MongoDB
            with TypeScript support.
          </li>
          <li>
            <strong>Zod</strong> – Schema validation for requests and responses.
          </li>
          <li>
            <strong>Clerk Webhooks</strong> – Handle user lifecycle events
            (signup, deletion, etc.).
          </li>
          <li>
            <strong>Stripe Webhooks</strong> – Sync subscription status, handle
            invoices, payments, etc.
          </li>
          <li>
            <strong>CSRF Protection</strong> – Prevent cross-site request
            forgery.
          </li>
          <li>
            <strong>CORS Configuration</strong> – Allow secure API access from
            specific origins.
          </li>
          <li>
            <strong>Security Headers</strong> – HTTP hardening to protect from
            XSS and clickjacking.
          </li>
        </ul>
      </section>

      <footer className="mt-16 text-sm text-gray-500 text-center">
        Built for devs
        <Link
          href="https://www.patreon.com/c/sylvaincodes"
          className="underline mx-4"
        >
          SylvainCodes
        </Link>
      </footer>
    </main>
  );
}
