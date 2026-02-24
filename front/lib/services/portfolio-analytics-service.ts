import { getToken } from "@/actions/auth";
import { apiClient } from "@/lib/api-client";

export interface PortfolioAnalyticResponse {
  success: boolean;
  message: string;
  views?: number;
}

export interface ViewsByDay {
  date: string; // ISO string from backend
  views: number;
}

export interface PortfolioAnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: ViewsByDay[];
}

export interface SinglePortfolioAnalyticsResponse {
  success: boolean;
  data: SinglePortfolioAnalyticsData;
  message?: string;
}
export interface SinglePortfolioAnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByInterval: ViewsByInterval[];
}
export interface ViewsByInterval {
  _id: Record<string, number>; // e.g., { year: 2025, month: 9, day: 5 } or { year: 2025, week: 36 }
  views: number;
}


export interface PortfolioAnalyticsResponse {
  success: boolean;
  data: PortfolioAnalyticsData;
  message?: string;
}

class PortfolioAnalyticsService {
  private async getAuthHeaders() {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async addView(
    portfolioId: string,
    slug: string
  ): Promise<PortfolioAnalyticResponse> {
    const headers = await this.getAuthHeaders();

    const response = await apiClient.post<PortfolioAnalyticResponse>(
      `/api/public/portfolio/${slug}/addview`,
      { portfolioId },
      { headers }
    );

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to add view");
  }

  async getPortfolioAnalyticsData(): Promise<PortfolioAnalyticsData> {
    const headers = await this.getAuthHeaders();

    const response = await apiClient.get<PortfolioAnalyticsResponse>(
      "/api/user/portfolio-analytics",
      { headers }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error("Failed to fetch portfolio analytics");
  }

  async getPortfolioAnalytics(filters: {
    portfolioIds?: string[];
    startDate?: Date;
    endDate?: Date;
    interval?: "daily" | "weekly" | "monthly" | "yearly";
  }) {
    const headers = await this.getAuthHeaders();
    const params = new URLSearchParams();
    filters.portfolioIds?.forEach((id) => params.append("portfolioIds", id));
    if (filters.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters.endDate)
      params.append("endDate", filters.endDate.toISOString());
    if (filters.interval) params.append("interval", filters.interval);

    const response = await apiClient.get<SinglePortfolioAnalyticsResponse>(
      `/api/user/single-portfolio-analytics?${params.toString()}`,
      { headers }
    );
    if (!response.data.success)
      throw new Error("Failed to fetch portfolio analytics");
    return response.data.data;
  }
}

export const portfolioAnalyticsService = new PortfolioAnalyticsService();
