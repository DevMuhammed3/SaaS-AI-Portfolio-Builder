"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import { m } from "framer-motion";
import { ThemeToggle } from "@/components/custom/theme-toggle";

export default function Login({ className }: { className?: string }) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className={`flex gap-8 ${className}`}>
      {isLoaded && (
        <>
          {isSignedIn ? (
            <div className="flex flex-row items-center gap-4">
              <div className="flex justify-center pt-2">
                <UserButton />
              </div>
            </div>
          ) : (
            <SignInButton mode="modal">
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                  Sign in
                </Button>
              </m.div>
            </SignInButton>
          )}
        </>
      )}

      <ThemeToggle />
    </div>
  );
}
