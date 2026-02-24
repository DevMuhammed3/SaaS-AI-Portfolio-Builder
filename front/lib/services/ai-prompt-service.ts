import { apiClient } from "@/lib/api-client";
import type {
  Experience,
  PortfolioProfile,
  Project,
} from "./portfolios-service";
import { devLog } from "@/lib/utils";
import { getToken } from "@/actions/auth";

export interface GenerateExperienceRequest {
  userProfile?: {
    name?: string;
    title?: string;
    bio?: string;
  };
}

export interface GenerateProfileRequest {
  industry?: string;
  role?: string;
}

export interface GenerateProjectsRequest {
  userProfile?: {
    name?: string;
    title?: string;
    bio?: string;
  };
  technologies?: string[];
}

export interface AIPromptResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * AI Prompt Service
 *
 * Service for generating portfolio data using AI prompts.
 * Uses DeepSeek API through the configured API client.
 */
class AIPromptService {
  private async getAuthHeaders() {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Generate work experience data using AI
   */
  async generateExperience(
    request: GenerateExperienceRequest
  ): Promise<AIPromptResponse<Experience[]>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.post(
        "/api/user/prompt/experience",
        request,
        { headers }
      );

      return response.data;
    } catch (error) {
      devLog.error("Error generating experience data:", error);
      return {
        success: false,
        error: "Failed to generate experience data",
      };
    }
  }

  /**
   * Generate profile information using AI
   */
  async generateProfile(
    request: GenerateProfileRequest
  ): Promise<AIPromptResponse<PortfolioProfile>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await apiClient.post(
        "/api/user/prompt/profile",
        request,
        { headers }
      );
      return response.data;
    } catch (error) {
      devLog.error("Error generating profile data:", error);
      return {
        success: false,
        error: "Failed to generate profile data",
      };
    }
  }

  /**
   * Generate projects data using AI
   */
  async generateProjects(
    request: GenerateProjectsRequest
  ): Promise<AIPromptResponse<Project[]>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await apiClient.post(
        "/api/user/prompt/projects",
        request,
        { headers }
      );
      return response.data;
    } catch (error) {
      devLog.error("Error generating projects data:", error);
      return {
        success: false,
        error: "Failed to generate projects data",
      };
    }
  }
}

export const aiPromptService = new AIPromptService();
