import React from "react";
import FramerMotionProvider from "./framer-motion-provider";
import ClerkProvider from "./clerk-provider";
import ToasterProvider from "./ToastProvider";
import StateProvider from "./state-provider";
import TooltipProvider from "./tooltip-provider";
import { IntlProvider } from "./intl-provider.tsx";
import { ThemeProvider } from "./theme-provider";
// import { SentryProvider } from "./sentry-provider.tsx";

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}) {
  return (
    // <SentryProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StateProvider>
        <ClerkProvider>
          <FramerMotionProvider>
            <TooltipProvider>
              {/* <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            > */}
              <IntlProvider locale={locale} messages={messages}>
                {children}
              </IntlProvider>
            </TooltipProvider>
          </FramerMotionProvider>
          <ToasterProvider />
          {/* </ThemeProvider> */}
        </ClerkProvider>
      </StateProvider>
    </ThemeProvider>
    // </SentryProvider>
  );
}
