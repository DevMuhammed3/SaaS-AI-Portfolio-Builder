"use client";

import { IntlProvider as ReactIntlProvider } from "react-intl";
import type { ReactNode } from "react";

interface IntlProviderProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
}

export function IntlProvider({
  children,
  locale,
  messages,
}: IntlProviderProps) {
  return (
    <ReactIntlProvider locale={locale} messages={messages} defaultLocale="en">
      {children}
    </ReactIntlProvider>
  );
}
