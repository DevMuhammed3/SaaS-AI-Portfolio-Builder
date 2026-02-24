"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Container from "@/components/custom/container";
import BackButton from "@/components/custom/back";
import { Plan } from "@/types";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { usePortfolios } from "@/hooks/usePortfolios";
import { Portfolio } from "@/lib/services/portfolios-service";

type Interval = "daily" | "weekly" | "monthly" | "yearly";

export default function AnalyticsContent({ plan }: { plan: Plan }) {
  const {
    portfolios,
    fetchPortfolios,
    loading: portfolioLoading,
  } = usePortfolios();

  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)));
  const [endDate, setEndDate] = useState(new Date());
  const [interval, setInterval] = useState<Interval>("monthly");

  const {
    loading,
    portfolioSingleAnalyticsData,
    fetchPortfolioSingleAnalyticsData,
  } = usePortfolioAnalytics(selectedPortfolio ?? undefined);

  // Fetch portfolios on mount
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Auto-select first portfolio when fetched
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios, selectedPortfolio]);

  // Fetch analytics whenever portfolio, interval, or date range changes
  useEffect(() => {
    if (selectedPortfolio?._id) {
      fetchPortfolioSingleAnalyticsData({
        portfolioIds: [selectedPortfolio._id],
        startDate,
        endDate,
        interval,
      });
    }
  }, [
    selectedPortfolio,
    startDate,
    endDate,
    interval,
    fetchPortfolioSingleAnalyticsData,
  ]);

  // Prepare chart data
  const chartData =
    portfolioSingleAnalyticsData?.viewsByInterval.map((item) => ({
      label:
        interval === "daily"
          ? `${item._id.day}/${item._id.month}/${item._id.year}`
          : interval === "weekly"
            ? `Week ${item._id.week} ${item._id.year}`
            : interval === "monthly"
              ? `${item._id.month}/${item._id.year}`
              : `${item._id.year}`,
      views: item.views,
    })) ?? [];

  if (loading || portfolioLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!plan || !selectedPortfolio) return null;

  return (
    <section className="p-6 space-y-6">
      <Container className="max-w-7xl space-y-10">
        <BackButton />
        {/* Portfolio & Date Range Selection */}
        <Card className="p-4 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
          {/* Portfolio Select */}
          <div className="flex-1 space-y-4">
            <CardTitle>Select Portfolio</CardTitle>
            <Select
              value={selectedPortfolio._id}
              onValueChange={(id) =>
                setSelectedPortfolio(portfolios.find((p) => p._id === id)!)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interval Select */}
          <div className="flex-1 space-y-4">
            <CardTitle>Select Interval</CardTitle>
            <Select
              value={interval}
              onValueChange={(value) => setInterval(value as Interval)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Picker */}
          <div className="flex-1 space-y-2">
            <CardTitle>Select Date Range</CardTitle>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="border px-4 py-2 rounded w-full text-left">
                    Start: {startDate.toLocaleDateString()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="border px-4 py-2 rounded w-full text-left">
                    End: {endDate.toLocaleDateString()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* Analytics Card */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" /> Total Views:{" "}
              {portfolioSingleAnalyticsData?.totalViews}
            </CardTitle>
            <CardDescription>
              Evolution of views from{" "}
              <strong>{startDate.toLocaleDateString()}</strong> to{" "}
              <strong>{endDate.toLocaleDateString()}</strong> ({interval})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    label={{
                      value: "Date", // legend text
                      position: "insideBottom", // or "bottom"
                      offset: -5,
                      style: { fontSize: 14, fill: "#374151" }, // Tailwind slate-700
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Views", // legend text
                      angle: -90, // rotate for vertical
                      position: "insideLeft", // or "left"
                      offset: 10,
                      style: { fontSize: 14, fill: "#374151" },
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
