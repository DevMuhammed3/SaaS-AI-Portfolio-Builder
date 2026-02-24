"use client";

import React from "react";
import Logo from "@/components/custom/logo";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import Container from "@/components/custom/container";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-muted p-4 text-sm text-muted-foreground">
      <Container>
        <div className="flexflex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <Logo />

          {/* Copyright */}
          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} 10minportfolio. All rights reserved.
          </p>

          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
};
