"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { m } from "framer-motion";
import { Palette, Settings, Briefcase } from "lucide-react";
import { useLocalizedRouter } from "@/hooks/useLocalizedRouter";
import BackButton from "@/components/custom/back";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { LocaleLink } from "@/components/custom/locale-link";
import type {
  FeatureItem,
  FeaturesPageProps,
  FeatureCardProps,
  CTASectionProps,
} from "@/types/features";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { ErrorBoundary } from "@/components/custom/error-boundary";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  secureNavigate,
  SecureRateLimiter,
  SecurityMonitor,
} from "@/lib/security";
import { devLog } from "@/lib/utils";
import { memo, useCallback, useMemo, useEffect } from "react";

const heroFeatures: FeatureItem[] = [
  {
    icon: Briefcase,
    title: "Multiple Portfolios",
    description:
      "Create unlimited portfolios for different jobs and industries",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Premium Templates",
    description: "Access dozens of professionally designed templates",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Settings,
    title: "Advanced Customization",
    description: "Customize every aspect of your portfolio design",
    color: "from-green-500 to-emerald-500",
  },
];

const navigationRateLimiter = new SecureRateLimiter(
  "features_navigation",
  5,
  30000
);

/**
 * Memoized Feature Card Component for better performance
 * Displays individual feature with enhanced accessibility and security
 */
const FeatureCard = memo<FeatureCardProps>(({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      role="listitem"
    >
      <Card
        className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        tabIndex={0}
        role="article"
        aria-labelledby={`feature-title-${index}`}
        aria-describedby={`feature-desc-${index}`}
      >
        <CardHeader className="text-center pb-8">
          <div
            className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
            role="img"
            aria-label={`${feature.title} icon`}
          >
            <Icon className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          <CardTitle
            id={`feature-title-${index}`}
            className="text-2xl font-bold mb-2 dark:text-slate-700"
          >
            {feature.title}
          </CardTitle>
          <CardDescription
            id={`feature-desc-${index}`}
            className="text-slate-600 text-lg"
          >
            {feature.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </m.div>
  );
});

FeatureCard.displayName = "FeatureCard";

/**
 * Memoized CTA Section Component
 * Handles call-to-action buttons with enhanced accessibility and security
 */
const CTASection = memo<CTASectionProps>(({ isSignedIn, role, onNavigate }) => {
  const { containerRef } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableTabNavigation: true,
  });

  const handlePricingClick = useCallback(() => {
    try {
      if (!navigationRateLimiter.isAllowed()) {
        SecurityMonitor.getInstance().reportViolation(
          "RateLimit",
          "Pricing navigation rate limit exceeded wait 30 second or go to another page"
        );
        return;
      }

      onNavigate("/pricing");
    } catch (error) {
      devLog.error("Navigation error:", error);
      SecurityMonitor.getInstance().reportViolation(
        "NavigationError",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }, [onNavigate]);

  return (
    <m.section
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
      role="region"
      aria-labelledby="cta-heading"
      aria-describedby="cta-description"
    >
      <h2 id="cta-heading" className="text-3xl font-bold mb-4">
        Ready to Experience All These Features?
      </h2>
      <p id="cta-description" className="text-blue-100 mb-8 max-w-2xl mx-auto">
        Start building your professional portfolio today and unlock all the
        powerful features that will help you stand out.
      </p>
      <div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        role="group"
        aria-label="Call to action buttons"
      >
        {isSignedIn ? (
          <Button size="lg" variant="outline" asChild>
            <LocaleLink
              href={role === "admin" ? "/admin" : "/user"}
              className="text-black"
              aria-label={`Go to ${
                role === "admin" ? "admin" : "user"
              } dashboard`}
            >
              Dashboard
            </LocaleLink>
          </Button>
        ) : (
          <SignUpButton fallbackRedirectUrl="/user/portfolios/new" mode="modal">
            <Button
              size="lg"
              variant="outline"
              aria-label="Create your portfolio account"
              className="text-black dark:bg-white"
            >
              Create Your Portfolio
            </Button>
          </SignUpButton>
        )}
        <Button
          onClick={handlePricingClick}
          size="lg"
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
          aria-label="View pricing plans and options"
        >
          View Pricing
        </Button>
      </div>
    </m.section>
  );
});

CTASection.displayName = "CTASection";

/**
 * Enhanced Features Page Component
 * Displays all available features with comprehensive accessibility and security
 */
export function FeaturesPage({ role }: FeaturesPageProps) {
  const router = useLocalizedRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { containerRef } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableTabNavigation: true,
  });

  const handleNavigation = useCallback(
    (path: string) => {
      try {
        if (!navigationRateLimiter.isAllowed()) {
          SecurityMonitor.getInstance().reportViolation(
            "RateLimit",
            "Navigation rate limit exceeded"
          );
          return;
        }

        if (!secureNavigate(path, router)) {
          SecurityMonitor.getInstance().reportViolation(
            "UnsafeNavigation",
            `Blocked navigation to: ${path}`
          );
        }
      } catch (error) {
        devLog.error("Navigation error:", error);
        SecurityMonitor.getInstance().reportViolation(
          "NavigationError",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    [router]
  );

  const featureCards = useMemo(
    () =>
      heroFeatures.map((feature, index) => (
        <FeatureCard key={feature.title} feature={feature} index={index} />
      )),
    []
  );

  useEffect(() => {
    // Monitor for suspicious activity on this page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        devLog.info("[Security] Features page hidden");
      } else {
        devLog.info("[Security] Features page visible");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isLoaded) {
    return (
      <ErrorBoundary boundaryId="features-loading" maxRetries={2}>
        <div
          className="h-screen flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner size="lg" label="Loading features page..." />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      boundaryId="features-main"
      maxRetries={3}
      onError={(error) => {
        SecurityMonitor.getInstance().reportViolation(
          "ComponentError",
          error.message
        );
      }}
    >
      <div className="h-screen">
        <Container className="py-16">
          <ErrorBoundary boundaryId="features-navigation" maxRetries={1}>
            <nav aria-label="Page navigation">
              <BackButton />
            </nav>
          </ErrorBoundary>

          <main
            id="main-content"
            ref={containerRef}
            className="flex flex-col gap-10"
            tabIndex={-1}
          >
            {/* Header */}
            <ErrorBoundary boundaryId="features-header" maxRetries={2}>
              <m.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Everything You Need to
                  <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    &nbsp; Succeed
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Discover all the powerful features that make our portfolio
                  builder the perfect choice for professionals.
                </p>
              </m.header>
            </ErrorBoundary>

            {/* Hero Features */}
            <ErrorBoundary boundaryId="features-list" maxRetries={2}>
              <section aria-labelledby="features-heading">
                <h2 id="features-heading" className="sr-only">
                  Available Features
                </h2>
                <div
                  className="grid md:grid-cols-3 gap-8"
                  role="list"
                  aria-label="Feature list"
                >
                  {featureCards}
                </div>
              </section>
            </ErrorBoundary>

            {/* CTA Section */}
            <ErrorBoundary boundaryId="features-cta" maxRetries={2}>
              <CTASection
                isSignedIn={!!isSignedIn}
                role={role}
                onNavigate={handleNavigation}
              />
            </ErrorBoundary>
          </main>
        </Container>
      </div>
    </ErrorBoundary>
  );
}
