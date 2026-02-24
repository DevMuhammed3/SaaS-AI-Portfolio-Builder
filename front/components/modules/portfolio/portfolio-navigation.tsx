"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Portfolio } from "@/lib/services/portfolios-service";
import { devLog } from "@/lib/utils";

interface PortfolioNavigationProps {
  portfolio: Portfolio;
}

export function PortfolioNavigation({ portfolio }: PortfolioNavigationProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolio.name} - ${portfolio.profile.title}`,
          text: portfolio.profile.bio,
          url: window.location.href,
        });
      } catch (error) {
        devLog.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Portfolio link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    toast.info(
      "Upgrade to premium to convert your portfolio to a beautiful CV"
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-portfolio-border-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div
            className="font-extrabold text-sm md:text-2xl cursor-pointer portfolio-text-primary dark:text-white hover:portfolio-text-secondary transition-colors select-none"
            onClick={() => scrollToSection("home")} // assuming you have a home section
            aria-label="Go to Home"
          >
            {portfolio.profile.title}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative text-sm font-semibold transition-colors
              ${
                activeSection === section.id
                  ? "portfolio-text-primary "
                  : "text-muted-foreground"
              }
              hover:portfolio-text-gray-700 dark:hover:text-slate-200
              before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-[2px] before:rounded-md
              before:transition-all
              ${
                activeSection === section.id
                  ? "before:portfolio-bg-primary before:opacity-100"
                  : "before:opacity-0 hover:before:portfolio-bg-secondary"
              }
            `}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="portfolio-text-primary hover:portfolio-text-secondary transition-colors"
              aria-label="Share portfolio"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="portfolio-text-primary hover:portfolio-text-secondary transition-colors"
              aria-label="Download resume"
            >
              <Download className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden portfolio-text-primary hover:portfolio-text-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-portfolio-border-primary bg-background/90 backdrop-blur-sm rounded-b-lg">
            <div className="flex flex-col space-y-3 px-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    scrollToSection(section.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-base font-semibold transition-colors px-3 py-2 rounded-md
                ${
                  activeSection === section.id
                    ? "portfolio-bg-primary text-white"
                    : "text-muted-foreground hover:portfolio-bg-secondary hover:text-white"
                }
              `}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
