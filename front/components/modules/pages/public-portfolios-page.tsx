"use client";

import { m } from "framer-motion";
import { memo, useCallback, useMemo, useEffect, useState } from "react";
import {
  Eye,
  ExternalLink,
  Star,
  Users,
  Briefcase,
  Code,
  Server,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/custom/container";
import { LocaleLink } from "@/components/custom/locale-link";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BackButton from "@/components/custom/back";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { cn, devLog } from "@/lib/utils";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { SecureRateLimiter, SecurityMonitor } from "@/lib/security";

/* --------------------------- Constants & Types --------------------------- */
const skillCategories = [
  { name: "All", count: 0, icon: Users },
  { name: "Frontend", count: 0, icon: Code },
  { name: "Backend", count: 0, icon: Server },
  { name: "DevOps", count: 0, icon: Settings },
  { name: "Design", count: 0, icon: Briefcase },
];

type Skill = { name: string; category?: string };
type Profile = {
  name?: string;
  title?: string;
  bio?: string;
  profilePhoto?: string;
};
type Portfolio = {
  _id: string;
  slug: string;
  isFeatured?: boolean;
  viewCount?: number;
  profile?: Profile;
  skills?: Skill[];
};

/* ----------------------------- Rate Limiter ----------------------------- */
const portfolioNavigationLimiter = new SecureRateLimiter(
  "portfolio_navigation",
  5,
  30000
);

/* ---------------------------- Memoized Components ---------------------------- */
const LoadingSkeleton = memo(() => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <CardContent className="pt-0">
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

const PaginationControls = memo(
  ({
    currentPage,
    totalPages,
    onChange,
  }: {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
  }) => (
    <div className="flex items-center text-gray-200 justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(page)}
            >
              {page}
            </Button>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="px-2">...</span>
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
);
PaginationControls.displayName = "PaginationControls";
const CategoryFilter = memo(
  ({
    categories,
    selected,
    onChange,
  }: {
    categories: typeof skillCategories;
    selected: string;
    onChange: (category: string) => void;
  }) => (
    <div className="flex justify-center flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant={selected === category.name ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(category.name)}
          className={cn(
            "flex items-center gap-2",
            selected === category.name ? "dark:text-dark" : "dark:text-white"
          )}
        >
          <category.icon className="h-4 w-4" />
          {category.name}
          <Badge variant="secondary" className="ml-1">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
);
CategoryFilter.displayName = "CategoryFilter";

const PortfolioCard = memo(({ portfolio }: { portfolio: Portfolio }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden py-0 cursor-pointer">
      <CardContent className="py-4">
        <LocaleLink
          target="_blank"
          className="flex items-center gap-3"
          href={`/${portfolio.slug}`}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={portfolio.profile?.profilePhoto}
              alt={portfolio.profile?.name || "Portfolio"}
            />
            <AvatarFallback>
              {portfolio.profile?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              {portfolio.profile?.name || "Anonymous"}
            </CardTitle>
            <CardDescription className="text-sm">
              {portfolio.profile?.title?.substring(0, 40) || "Professional"}
            </CardDescription>
          </div>
        </LocaleLink>
      </CardContent>
    </Card>
  );
});

PortfolioCard.displayName = "PortfolioCard";

const FeaturedPortfolioCard = memo(
  ({
    portfolio,
    onPreview,
  }: {
    portfolio: Portfolio;
    onPreview: (slug: string) => void;
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={portfolio.profile?.profilePhoto}
              alt={portfolio.profile?.name || "Portfolio"}
            />
            <AvatarFallback className="text-2xl">
              {portfolio.profile?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
            Featured
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Button
            onClick={() => onPreview(portfolio.slug)}
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ExternalLink className="h-4 w-4 mr-2" /> View Portfolio
          </Button>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={portfolio.profile?.profilePhoto || "/placeholder.svg"}
              alt={portfolio.profile?.name || "Portfolio"}
            />
            <AvatarFallback>
              {portfolio.profile?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {portfolio.profile?.name || "Anonymous"}
            </CardTitle>
            <CardDescription>
              {portfolio.profile?.title || "Professional"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {portfolio.profile?.bio ||
            "Professional portfolio showcasing skills and experience."}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {portfolio.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {portfolio.skills && portfolio.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{portfolio.skills.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {portfolio.viewCount || 0}
          </span>
        </div>
      </CardContent>
    </Card>
  )
);
FeaturedPortfolioCard.displayName = "FeaturedPortfolioCard";
/* ---------------------------- Main Page Component ---------------------------- */
export function PublicPortfoliosPage() {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { containerRef } = useKeyboardNavigation<HTMLDivElement>({
    enableArrowKeys: true,
    enableTabNavigation: true,
  });

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(searchParams.get("page") || "1")
  );

  const { portfolios, loading, error, pagination, fetchPublicPortfolios } =
    usePortfolios();

  const updateURL = useCallback(
    (filters: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All" && value !== 1)
          params.set(key, value.toString());
        else params.delete(key);
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(1);
      updateURL({ search: searchTerm, category, page: 1 });
    },
    [searchTerm, updateURL]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURL({ search: searchTerm, category: selectedCategory, page });
    },
    [searchTerm, selectedCategory, updateURL]
  );

  const handlePreview = useCallback((slug: string) => {
    try {
      if (!portfolioNavigationLimiter.isAllowed()) {
        SecurityMonitor.getInstance().reportViolation(
          "RateLimit",
          "Portfolio preview rate limit exceeded"
        );
        return;
      }
      window.open(`/${slug}`, "_blank");
    } catch (err) {
      devLog.error(err);
      SecurityMonitor.getInstance().reportViolation(
        "PreviewError",
        (err as Error).message
      );
    }
  }, []);

  useEffect(() => {
    fetchPublicPortfolios({
      search: searchTerm || undefined,
      category:
        selectedCategory !== "All" ? selectedCategory.toLowerCase() : undefined,
      page: currentPage,
      limit: 12,
    });
  }, [searchTerm, selectedCategory, currentPage, fetchPublicPortfolios]);

  const featured = useMemo(
    () => portfolios.filter((p) => p.isFeatured),
    [portfolios]
  );
  const regular = useMemo(
    () => portfolios.filter((p) => !p.isFeatured),
    [portfolios]
  );

  const categories = useMemo(() => {
    return skillCategories.map((category) => {
      if (category.name === "All")
        return { ...category, count: pagination.total };
      const count = portfolios.filter((p) =>
        p.skills?.some(
          (s) => s.category?.toLowerCase() === category.name.toLowerCase()
        )
      ).length;
      return { ...category, count };
    });
  }, [portfolios, pagination.total]);

  return (
    <div className="py-20" ref={containerRef}>
      <Container>
        <BackButton />

        {/* Hero */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center m-16"
        >
          <p className="text-base md:text-xl text-slate-600 md:max-w-3xl mx-auto dark:text-slate-100">
            Browse through our collection of public portfolios and get inspired
            by amazing work from professionals worldwide.
          </p>
        </m.div>

        {/* Filters */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={handleCategoryChange}
          />
        </m.div>

        {/* Loading / Error */}
        {loading && <LoadingSkeleton />}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchPublicPortfolios()}>Try Again</Button>
          </div>
        )}

        {/* Featured Portfolios */}
        {!loading && !error && featured.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" /> Featured Portfolios
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((portfolio, index) => (
                <m.div
                  key={portfolio._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <FeaturedPortfolioCard
                    portfolio={portfolio}
                    onPreview={handlePreview}
                  />
                </m.div>
              ))}
            </div>
          </m.div>
        )}

        {/* All Portfolios */}
        {!loading && !error && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-8">
              All Portfolios ({pagination.total})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((portfolio, index) => (
                <m.div
                  key={portfolio._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.05 }}
                >
                  <PortfolioCard portfolio={portfolio} />
                </m.div>
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onChange={handlePageChange}
              />
            )}
          </m.div>
        )}

        {/* Empty State */}
        {!loading && !error && portfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              No portfolios found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setCurrentPage(1);
                updateURL({ search: "", category: "All", page: 1 });
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience All These Features?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Start building your professional portfolio today and unlock all the
            powerful features that will help you stand out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Button size="lg" variant="secondary" asChild>
                <LocaleLink href="/user/portfolios">Dashboard</LocaleLink>
              </Button>
            ) : (
              <SignUpButton
                fallbackRedirectUrl="/user/portfolios/new"
                mode="modal"
              >
                <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="secondary">
                    Create your portfolio
                  </Button>
                </m.div>
              </SignUpButton>
            )}
          </div>
        </m.div>
      </Container>
    </div>
  );
}
