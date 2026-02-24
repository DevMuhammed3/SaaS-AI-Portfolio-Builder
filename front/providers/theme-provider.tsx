"use client";

import React from "react";
import { ThemeProvider as NextThemesProviders } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProviders>;

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProviders {...props}>{children}</NextThemesProviders>;
};
