"use client";

import { LocaleLink } from "@/components/custom/locale-link";
import ProtectedLink from "@/components/custom/protected-link";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function MobileMenuPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute p-4 bg-white shadow-md top-15 right-0 space-y-4 w-full">
      <ProtectedLink
        href="/public-portfolios"
        className="block text-sm font-medium text-slate-700 hover:text-primary-500 transitions-colors duration-300"
      >
        <FormattedMessage
          id="header.publicPortfolios"
          defaultMessage="Public portfolios"
        />
      </ProtectedLink>

      <LocaleLink
        href="/pricing"
        onClick={onClose}
        className="block text-sm font-medium text-slate-700 hover:text-primary-500 transitions-colors duration-300"
      >
        <FormattedMessage id="header.pricing" defaultMessage="Pricing" />
      </LocaleLink>
    </div>
  );
}
