/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 * Essential for accessibility compliance
 */

"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  /** Target element ID to skip to */
  href: string;
  /** Link text content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skip link that appears on focus for keyboard navigation
 * Helps users bypass repetitive navigation elements
 */
export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible on focus
        "absolute left-4 top-4 z-[9999] -translate-y-full",
        "focus:translate-y-0",
        // Styling
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-md font-medium text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-transform duration-200",
        className
      )}
      onFocus={(e) => {
        // Ensure the link is visible when focused
        e.currentTarget.scrollIntoView({ block: "nearest" });
      }}
    >
      {children}
    </a>
  );
}
