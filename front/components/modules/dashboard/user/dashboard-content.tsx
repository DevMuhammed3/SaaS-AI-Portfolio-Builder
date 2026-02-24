"use client";

import { useUser } from "@clerk/nextjs";
import { useIntl } from "react-intl";
import { memo, useCallback, useEffect, useMemo } from "react";
import { m, easeOut } from "framer-motion";
import {
  Plus,
  Eye,
  BarChart3,
  Settings,
  Calendar,
  TrendingUp,
  Lock,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/custom/container";
import { LocaleLink } from "@/components/custom/locale-link";
import PremiumButton from "@/components/custom/premium-button";
import { useLocalizedRouter } from "@/hooks/useLocalizedRouter";
import { Plan } from "@/types";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { Button } from "@/components/ui/button";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { PortfolioAnalyticsData } from "@/lib/services/portfolio-analytics-service";

/* -------------------------- Animations -------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};
export interface ViewsByDay {
  day: number; // ISO string from backend
  views: number;
}
/* -------------------------- Components -------------------------- */
const QuickActionCard = memo(
  ({
    icon,
    title,
    description,
    buttonLabel,
    href,
    variant = "outline",
    locked = false,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonLabel: string;
    href?: string;
    variant?: "outline" | "secondary";
    locked?: boolean;
    onClick?: () => void;
  }) => (
    <Card className="border transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-primary-500">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {href ? (
          <Button
            variant={variant}
            className="w-full"
            asChild
            aria-label={title}
          >
            <LocaleLink href={href}>
              {locked && <Lock className="h-4 w-4 mr-1" aria-hidden="true" />}
              {buttonLabel}
            </LocaleLink>
          </Button>
        ) : (
          <Button
            variant={variant}
            className="w-full"
            onClick={onClick}
            aria-label={title}
          >
            {locked && <Lock className="h-4 w-4 mr-1" aria-hidden="true" />}
            {buttonLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
);
QuickActionCard.displayName = "QuickActionCard";

const PortfolioViewsChart = memo(
  ({ data, plan }: { data: ViewsByDay[]; plan: Plan }) => {
    return (
      <Card className="border-primary-100 h-full">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800 flex items-center dark:text-slate-200">
            <Calendar className="h-5 w-5 mr-2" aria-hidden="true" />
            Portfolio Views
          </CardTitle>
          <CardDescription>Daily views for this month</CardDescription>
        </CardHeader>
        <CardContent className="relative py-4">
          {plan !== "premium" && <PremiumButton />}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  label={{
                    value: "Day of Month", // legend text
                    position: "insideBottom", // or "bottom"
                    offset: -5,
                    style: { fontSize: 14, fill: "#374151" }, // Tailwind slate-700
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  label={{
                    value: "Views", // legend text
                    angle: -90, // rotate for vertical
                    position: "insideLeft", // or "left"
                    offset: 10,
                    style: { fontSize: 14, fill: "#374151" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                  }}
                  cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#ff2dbd"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
);
PortfolioViewsChart.displayName = "PortfolioViewsChart";

const VisitorStats = memo(
  ({ stats, plan }: { stats: PortfolioAnalyticsData | null; plan: Plan }) => (
    <Card className="border-secondary-100 h-full">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800 flex items-center dark:text-slate-200">
          <BarChart3 className="h-5 w-5 mr-2" aria-hidden="true" />
          Visitor Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {plan !== "premium" && <PremiumButton />}
        {/* Example: Total Views */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-xs font-medium text-blue-800">
                Total Views
              </span>
            </div>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {stats ? stats.totalViews.toLocaleString() : 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span className="text-xs font-medium text-green-800">
                Unique Visitors
              </span>
            </div>
            <p className="text-lg font-bold text-green-900 mt-1">
              {stats ? stats.uniqueVisitors.toLocaleString() : 0}
            </p>
          </div>
        </div>
        {/* Today */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-800">This month</p>
              <p className="text-lg font-bold text-purple-900">
                {/* {stats.todayViews} */}
              </p>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">
                {/* +{stats.weeklyGrowth}% */}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
VisitorStats.displayName = "VisitorStats";

/* -------------------------- Main Dashboard -------------------------- */
export default function DashboardContent({ plan }: { plan: Plan }) {
  const { portfolioAnalyticsData, fetchPortfolioAnalyticsData } =
    usePortfolioAnalytics();

  useEffect(() => {
    fetchPortfolioAnalyticsData();
  }, [fetchPortfolioAnalyticsData]);

  const data = useMemo(() => {
    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    // Map backend data into a lookup (day -> views)
    const viewsMap = new Map<number, number>();
    portfolioAnalyticsData?.viewsByDay.forEach((entry) => {
      const day = new Date(entry.date).getDate();
      viewsMap.set(day, entry.views);
    });

    // Generate all days with fallback 0
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      views: viewsMap.get(i + 1) ?? 0,
    }));
  }, [portfolioAnalyticsData]);

  const { user, isLoaded } = useUser();
  const intl = useIntl();
  const router = useLocalizedRouter();
  const { containerRef } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableTabNavigation: true,
  });

  const handleAnalyticsClick = useCallback(() => {
    if (plan === "premium") {
      router.push("/user/analytics");
    } else {
      router.push("/checkout");
    }
  }, [plan, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div
          role="status"
          aria-label="Loading dashboard"
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Container>
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-12 space-y-8"
          ref={containerRef}
        >
          {/* Header */}
          <m.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="">
              {intl.formatMessage(
                {
                  id: "dashboard.welcome",
                  defaultMessage: "Welcome back, {name}!",
                },
                { name: user?.firstName || "Developer" }
              )}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto dark:text-slate-400">
              {intl.formatMessage({
                id: "dashboard.subtitle",
                defaultMessage:
                  "Manage your portfolios, track analytics, and showcase your work to the world.",
              })}
            </p>
          </m.div>

          {/* Quick Actions */}
          <m.div variants={itemVariants}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                icon={<Plus className="h-6 w-6 text-primary-600" />}
                title="Create Portfolio"
                description="Start building a new portfolio"
                buttonLabel="Get Started"
                href="/user/portfolios/new"
                variant="secondary"
              />
              <QuickActionCard
                icon={<Eye className="h-6 w-6 text-secondary-600" />}
                title="View Portfolios"
                description="Manage your existing portfolios"
                buttonLabel="View All"
                href="/user/portfolios"
                variant="outline"
              />
              <QuickActionCard
                icon={<BarChart3 className="h-6 w-6 text-slate-600" />}
                title="Analytics"
                description="Track your portfolio performance"
                buttonLabel={
                  plan !== "premium" ? "Unlock Access" : "View Stats"
                }
                locked={plan !== "premium"}
                onClick={handleAnalyticsClick}
              />
              <QuickActionCard
                icon={<Settings className="h-6 w-6 text-slate-600" />}
                title="Settings"
                description="Manage your account settings"
                buttonLabel="Manage"
                href="/user/settings"
              />
            </div>
          </m.div>

          {/* Activity & Stats */}
          <m.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PortfolioViewsChart data={data} plan={plan} />
            </div>
            <VisitorStats stats={portfolioAnalyticsData} plan={plan} />
          </m.div>
        </m.div>
      </Container>
    </div>
  );
}
