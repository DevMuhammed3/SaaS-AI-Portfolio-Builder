"use client";

import Container from "@/components/custom/container";
import { LocaleLink } from "@/components/custom/locale-link";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ExternalLink } from "lucide-react";
import type { FooterLink } from "@/types/landing";

/**
 * Footer Component
 * Site footer with navigation links and legal pages
 * Enhanced with TypeScript types and accessibility
 */
export default function Footer() {
  const { handleError } = useErrorHandler();

  const footerLinks: FooterLink[] = useMemo(() => {
    try {
      return [
        {
          id: "about",
          labelKey: "footer.about",
          href: "/about",
          ariaLabel: "Learn more about our company",
        },
        {
          id: "help",
          labelKey: "footer.help",
          href: "/help",
          ariaLabel: "Get help and support",
        },
        {
          id: "privacy",
          labelKey: "footer.privacy",
          href: "/privacy",
          ariaLabel: "Read our privacy policy",
        },
        {
          id: "patreon",
          labelKey: "footer.patreon",
          href: "https://www.patreon.com/c/sylvaincodes",
          external: true,
          ariaLabel: "Support us on Patreon (opens in new tab)",
        },
      ];
    } catch (error) {
      handleError(error as Error, "Footer", "FOOTER_CONFIG_ERROR");
      return [];
    }
  }, [handleError]);

  const renderFooterLink = (link: FooterLink) => {
    try {
      return (
        <li key={link.id}>
          <LocaleLink
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1"
            aria-label={link.ariaLabel}
          >
            <FormattedMessage
              id={link.labelKey}
              defaultMessage={link.labelKey.split(".").pop() || "Link"}
            />
            {link.external && (
              <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
            )}
          </LocaleLink>
        </li>
      );
    } catch (error) {
      handleError(error as Error, "Footer", "FOOTER_LINK_RENDER_ERROR");
      return (
        <li key={link.id}>
          <span className="text-muted-foreground">
            {link.labelKey.split(".").pop()}
          </span>
        </li>
      );
    }
  };

  return (
    <footer
      className="border-t bg-background"
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container>
        <div className="py-8 md:py-12">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-4 md:flex-row md:gap-8 md:justify-center items-center">
              {footerLinks.map(renderFooterLink)}
            </ul>
          </nav>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Portfolio Builder. All rights
              reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
