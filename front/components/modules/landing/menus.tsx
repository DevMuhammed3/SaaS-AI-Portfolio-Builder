"use client";
import { LocaleLink } from "@/components/custom/locale-link";
import ProtectedLink from "@/components/custom/protected-link";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

// Lazy-load the MobileMenuPanel
const MobileMenuPanel = dynamic(
  () => import("./mobile-menu-panel"), // We'll move the panel into a separate file
  {
    ssr: false, // Only render on client
    loading: () => <p>Loading menu panel...</p>,
  }
);

export default function Menus() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {/*  mobile nav */}
      <button
        className="text-slate-700 hover:text-primary-500 md:hidden"
        aria-label="Toggle menu"
        onClick={toggleMobileMenu}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile menu panel */}
      {isOpen && <MobileMenuPanel onClose={() => setIsOpen(false)} />}

      {/* Desktop nav */}
      <div className="hidden md:flex flex-1 items-end justify-center space-x-6">
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
          className="block text-md font-medium text-slate-700 hover:text-primary-500 transitions-colors duration-300"
        >
          <FormattedMessage id="header.pricing" defaultMessage="Pricing" />
        </LocaleLink>
      </div>
    </>
  );
}
