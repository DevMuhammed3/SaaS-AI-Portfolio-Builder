"use client";

import React from "react";
import { LocaleLink } from "@/components/custom/locale-link";
import { useUser, SignInButton } from "@clerk/nextjs";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ProtectedLink({
  href,
  children,
  className,
}: ProtectedLinkProps) {
  const { isSignedIn } = useUser();

  // If signed in, just render a normal link
  if (isSignedIn) {
    return (
      <LocaleLink href={href} className={className}>
        {children}
      </LocaleLink>
    );
  }

  // If not signed in, render a SignInButton modal
  return (
    <SignInButton fallbackRedirectUrl={href} mode="modal">
      <LocaleLink href="#" className={className}>
        {children}
      </LocaleLink>
    </SignInButton>
  );
}
