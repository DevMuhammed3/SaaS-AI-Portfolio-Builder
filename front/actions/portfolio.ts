import { apiClient } from "@/lib/api-client";
import { Portfolio } from "@/lib/services/portfolios-service";
import axios from "axios";
import { devLog } from "@/lib/utils";

export async function getPortfolioBySlug(
  slug: string
): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await apiClient.get(
      `${baseUrl}/api/public/portfolio/${slug}`
    );

    return response.data.portfolio || null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      devLog.error("Axios error:", error.response?.data || error.message);
    } else {
      devLog.error("Unexpected error:", error);
    }
    return null;
  }
}

export async function getAllPortfolioSlugs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await apiClient.get(`${baseUrl}/api/public/portfolio`, {});

    return response.data.portfolios.portfolios;
  } catch (error) {
    devLog.warn(error);
  }
}
