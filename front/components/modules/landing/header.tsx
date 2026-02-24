"use client";

import Container from "@/components/custom/container";
import { cn } from "@/lib/utils";
import Login from "./Login";
import Logo from "@/components/custom/logo";
import Menus from "./menus";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { HeaderProps } from "@/types/landing";

/**
 * Header Component
 * Main navigation header with logo, menus, and authentication
 * Enhanced with accessibility features and skip links
 */
export default function Header({ className }: HeaderProps) {
  const { handleError } = useErrorHandler();

  const renderHeaderContent = () => {
    try {
      return (
        <Container>
          <div className="flex items-center h-20 py-4">
            <div className="flex-shrink-0" role="banner">
              <Logo />
            </div>

            <div
              className="flex flex-1 justify-end items-center gap-6"
              id="navigation"
            >
              <Menus />
              <Login className="hidden md:flex" />
            </div>
          </div>
        </Container>
      );
    } catch (error) {
      handleError(error as Error, "Header");
      return (
        <Container>
          <div className="flex items-center justify-center h-20 py-4">
            <div
              role="alert"
              aria-live="polite"
              className="text-muted-foreground text-sm"
            >
              Navigation temporarily unavailable. Please refresh the page.
            </div>
          </div>
        </Container>
      );
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      role="banner"
      aria-label="Site header with main navigation"
    >
      {renderHeaderContent()}
    </header>
  );
}
