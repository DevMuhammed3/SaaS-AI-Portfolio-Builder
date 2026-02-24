import { getToken } from "@/actions/auth";
import { apiClient } from "../api-client";
import { handleApiError } from "../utils";
import { Template } from "./templates-services";
import { devLog } from "@/lib/utils";

export interface Portfolio {
  _id: string;
  userId: string;
  name: string;
  templateId: Template;
  slug: string;
  isFeatured?: boolean;
  profile: PortfolioProfile;
  skills: Skill[];
  certifications: Certification[];
  experiences: Experience[];
  projects: Project[];
  settings: PortfolioSettings;
  status: "draft" | "published" | "archived";
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  platform: string;
  url: string;
  username?: string;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  bio: string;
  location?: string;
  email: string;
  phone?: string;
  website?: string;
  profilePhoto?: string;
  socialMedia: SocialMedia[];
}

export interface PortfolioSettings {
  isPublic: boolean;
  allowComments: boolean;
  showContactInfo: boolean;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
}
export enum SkillCategory {
  Frontend = "frontend",
  Backend = "backend",
  DevOps = "devops",
  Database = "database",
  Tools = "tools",
  Other = "other",
}

export enum Proficiency {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
  Expert = "expert",
}

export type SkillProficiency =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
}

export interface Certification {
  name: string;
  provider: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
}

// Request/Response interfaces for API
export interface CreatePortfolioRequest {
  templateId: string;
  name: string;
  slug?: string;
  profile: PortfolioProfile;
  skills: Skill[];
  certifications: Certification[];
  experiences: Experience[];
  projects: Project[];
  settings: PortfolioSettings;
}
export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  completedDate?: Date;
}

export interface UpdatePortfolioRequest
  extends Partial<CreatePortfolioRequest> {
  id: string;
  status?: "draft" | "published" | "archived";
}

export interface PortfolioFilters {
  status?: "draft" | "published" | "archived";
  templateId?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "viewCount" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  category?: string;
  isFeatured?: boolean;
}

export interface PortfolioResponse {
  portfolios: Portfolio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PortfoliosService {
  private async getAuthHeaders() {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Get all portfolios for the current user
   */
  async getPortfolios(
    filters: PortfolioFilters = {}
  ): Promise<PortfolioResponse> {
    try {
      const headers = await this.getAuthHeaders();

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.templateId) params.append("templateId", filters.templateId);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get(url, { headers });
      if (response.data.success) {
        return response.data.portfolios;
      }

      throw new Error(response.data.error || "Failed to fetch portfolios");
    } catch (error) {
      devLog.error("Error fetching portfolios:", error);
      throw new Error("Failed to fetch portfolios");
    }
  }

  /**
   * Get a single portfolio by ID
   */
  async getPortfolioById(_id: string): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}`,
        { headers }
      );

      if (response.data.success) {
        return response.data.portfolio;
      }

      throw new Error(response.data.error || "Failed to fetch portfolio");
    } catch (error) {
      devLog.error("Error fetching portfolio:", error);
      throw new Error("Failed to fetch portfolio");
    }
  }

  /**
   * Get a portfolio by slug (public view)
   */
  async getPortfolioBySlug(slug: string): Promise<Portfolio> {
    try {
      const response = await apiClient.get<Portfolio>(
        `/api/public/portfolio/${slug}`
      );
      return response.data;
    } catch (error) {
      devLog.error("Error fetching portfolio by slug:", error);
      throw new Error("Failed to fetch portfolio");
    }
  }

  /**
   * Create a new portfolio
   */
  async createPortfolio(
    portfolioData: CreatePortfolioRequest
  ): Promise<Portfolio | null> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios`,
        portfolioData,
        { headers }
      );

      if (response.data.success) {
        return response.data.portfolio;
      }

      return response.data.portfolio;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  /**
   * Update an existing portfolio
   */
  async updatePortfolio(
    _id: string,
    portfolioData: Partial<UpdatePortfolioRequest>
  ): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}`,
        portfolioData,
        {
          headers,
        }
      );

      return response.data.portfolio;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Duplicate a portfolio
   */
  async duplicatePortfolio(_id: string): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}/duplicate`,
        {},
        {
          headers,
        }
      );

      if (response.data.success) {
        return response.data.portfolio;
      }

      throw new Error(response.data.error || "Failed to duplicate template");
      return response.data;
    } catch (error) {
      devLog.error("Error duplicating portfolio:", error);
      throw new Error("Failed to duplicate portfolio");
    }
  }

  /**
   * Delete a portfolio
   */
  async deletePortfolio(_id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}`,
        {
          headers,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to delete template");
      }
    } catch (error) {
      devLog.error("Error deleting portfolio:", error);
      throw new Error("Failed to delete portfolio");
    }
  }

  /**
   * Validate slug availability
   */
  async validateSlug(
    slug: string,
    excludeId?: string
  ): Promise<{ isValid: boolean; message?: string }> {
    try {
      const params = new URLSearchParams({ slug });
      if (excludeId) params.append("excludeId", excludeId);

      const response = await apiClient.get<{
        isValid: boolean;
        message?: string;
      }>(`/api/public/portfolios/validate-slug?${params.toString()}`);
      return response.data;
    } catch (error) {
      devLog.error("Error validating slug:", error);
      return { isValid: false, message: "Failed to validate slug" };
    }
  }

  /**
   * Publish a portfolio
   */
  async publishPortfolio(_id: string): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}/publish`,
        { status: "published" }, // optional if backend doesn't require
        {
          headers,
          withCredentials: true, // important for Clerk cookies
        }
      );

      if (response.data.success) {
        return response.data.portfolio;
      }

      throw new Error(response.data.error || "Failed to publish portfolio");
    } catch (error) {
      devLog.error("Error publishing portfolio:", error);
      throw new Error("Failed to publish portfolio");
    }
  }

  /**
   * Unpublish a portfolio
   */
  async unpublishPortfolio(_id: string): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}/unpublish`,
        {
          headers,
        }
      );

      if (response.data.success) {
        return response.data.template;
      }

      throw new Error(response.data.error || "Failed to delete template");
    } catch (error) {
      devLog.error("Error unpublishing portfolio:", error);
      throw new Error("Failed to unpublish portfolio");
    }
  }

  /**
   * Archive a portfolio
   */
  async archivePortfolio(_id: string): Promise<Portfolio> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/portfolios/${_id}/archive`,
        {
          headers,
        }
      );

      if (response.data.success) {
        return response.data.template;
      }

      throw new Error(response.data.error || "Failed to delete template");
    } catch (error) {
      devLog.error("Error archiving portfolio:", error);
      throw new Error("Failed to archive portfolio");
    }
  }

  /**
   * Get public portfolios
   */
  async getPublicPortfolios(
    filters: PortfolioFilters = {}
  ): Promise<PortfolioResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.templateId) params.append("templateId", filters.templateId);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.category) params.append("category", filters.category);

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/public/portfolio${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get(url, {
        cache: {
          ttl: 1000 * 60 * 5, // Cache for 5 minutes
        },
      });
      if (response.data.success) {
        return response.data.portfolios;
      }

      throw new Error(response.data.error || "Failed to fetch portfolios");
    } catch (error) {
      devLog.error("Error fetching public portfolios:", error);
      throw new Error("Failed to fetch public portfolios");
    }
  }
}

// Export singleton instance
export const portfoliosService = new PortfoliosService();
