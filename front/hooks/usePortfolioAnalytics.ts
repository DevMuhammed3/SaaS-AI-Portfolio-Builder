"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  PortfolioAnalyticsData,
  portfolioAnalyticsService,
  SinglePortfolioAnalyticsData,
} from "@/lib/services/portfolio-analytics-service";
import { devLog } from "@/lib/utils";
import { Portfolio } from "@/lib/services/portfolios-service";

export interface ViewsByDay {
  date: string; // ISO string from backend
  views: number;
}

export function usePortfolioAnalytics(portfolio?: Portfolio) {
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState<number | null>(null);
  const [portfolioAnalyticsData, setPortfolioAnalyticsData] =
    useState<PortfolioAnalyticsData | null>(null);
  const [portfolioSingleAnalyticsData, setPortfolioSingleAnalyticsData] =
    useState<SinglePortfolioAnalyticsData>();

  const addView = useCallback(async () => {
    if (!portfolio?._id || !portfolio?.slug) {
      console.warn("Portfolio ID or slug missing");
      return;
    }

    try {
      setLoading(true);
      const res = await portfolioAnalyticsService.addView(
        portfolio._id,
        portfolio.slug
      );
      setViews(res.views ?? null);
      devLog.info("View added:", res);
    } catch (error) {
      devLog.error("Error adding view:", error);
      toast.error("Failed to register portfolio view");
    } finally {
      setLoading(false);
    }
  }, [portfolio]);

  const fetchPortfolioAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await portfolioAnalyticsService.getPortfolioAnalyticsData();
      setPortfolioAnalyticsData(data);
    } catch (error) {
      devLog.error("Error fetching portfolio analytics:", error);
      toast.error("Failed to load portfolio analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPortfolioSingleAnalyticsData = useCallback(
    async (filters: {
      portfolioIds?: string[];
      startDate?: Date;
      endDate?: Date;
      interval?: "daily" | "weekly" | "monthly" | "yearly";
    }) => {
      setLoading(true);
      try {
        const data = await portfolioAnalyticsService.getPortfolioAnalytics(
          filters
        );
        setPortfolioSingleAnalyticsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    views,
    portfolioAnalyticsData,
    addView,
    fetchPortfolioAnalyticsData,
    fetchPortfolioSingleAnalyticsData,
    portfolioSingleAnalyticsData,
  };
}
