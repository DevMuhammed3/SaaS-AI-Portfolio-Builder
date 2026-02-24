"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps } from "react";
import * as React from "react";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { locale } = useParams();
  const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href;

  return <Link href={localizedHref} {...props} />;
}
