"use client";

import { useParams, useRouter } from "next/navigation";

export function useLocalizedRouter() {
  const router = useRouter();
  const { locale } = useParams();

  const push = (href: string) => {
    const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href;
    router.push(localizedHref);
  };

  const replace = (href: string) => {
    const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href;
    router.replace(localizedHref);
  };

  const prefetch = (href: string) => {
    const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href;
    router.prefetch(localizedHref);
  };

  return {
    ...router,
    push,
    replace,
    prefetch,
  };
}
