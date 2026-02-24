import { apiClient } from "@/lib/api-client";
import { getToken } from "@/actions/auth";
import { devLog } from "@/lib/utils";

export interface Template {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  font: string;
  primaryColor: string;
  secondaryColor: string;
  premium: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateData {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  font: string;
  primaryColor: string;
  secondaryColor: string;
  premium: boolean;
  status: "active" | "inactive";
}

export type UpdateTemplateData = Partial<CreateTemplateData> & {
  _id: string;
};

export interface TemplatesFilters {
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
  search?: string;
  tags?: string[];
  premium?: boolean;
}

export interface TemplatesResponse {
  data: Template[];
  total: number;
  page: number;
  totalPages: number;
}

class TemplatesService {
  private async getAuthHeaders() {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getAllTemplates(
    filters: TemplatesFilters = {}
  ): Promise<TemplatesResponse> {
    try {
      const headers = await this.getAuthHeaders();

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.premium !== undefined)
        params.append("premium", filters.premium.toString());
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append("tags", tag));
      }

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/templates${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get(url, { headers });
      if (response.data.success) {
        return response.data.templates;
      }

      throw new Error(response.data.error || "Failed to fetch portfolios");
    } catch (error) {
      devLog.error("Error fetching portfolios:", error);
      throw error;
    }
  }

  async getAllUserTemplates(
    filters: TemplatesFilters = {}
  ): Promise<TemplatesResponse> {
    try {
      const headers = await this.getAuthHeaders();

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.premium !== undefined)
        params.append("premium", filters.premium.toString());
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append("tags", tag));
      }

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/templates${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get(url, { headers });
      if (response.data.success) {
        return response.data.templates;
      }

      throw new Error(response.data.error || "Failed to fetch templates");
    } catch (error) {
      devLog.error("Error fetching templates:", error);
      throw error;
    }
  }

  async getTemplate(_id: string): Promise<Template> {
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
      throw error;
    }
  }

  async createTemplate(data: CreateTemplateData): Promise<Template> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/templates`,
        data,
        { headers }
      );

      if (response.data.success) {
        return response.data.template;
      }

      throw new Error(response.data.error || "Failed to create portfolio");
    } catch (error) {
      devLog.error("Error creating portfolio:", error);
      throw error;
    }
  }

  async updateTemplate(
    _id: string,
    data: UpdateTemplateData
  ): Promise<Template> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/templates/${_id}`,
        data,
        {
          headers,
        }
      );

      if (response.data.success) {
        return response.data.template;
      }

      throw new Error(response.data.error || "Failed to update portfolio");
    } catch (error) {
      devLog.error("Error updating portfolio:", error);
      throw error;
    }
  }

  async deleteTemplate(_id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/templates/${_id}`,
        {
          headers,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to delete portfolio");
      }
    } catch (error) {
      devLog.error("Error deleting portfolio:", error);
      throw error;
    }
  }

  async duplicateTemplate(_id: string): Promise<Template> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/templates/${_id}/duplicate`,
        {},
        {
          headers,
        }
      );

      if (response.data.success) {
        return response.data.template;
      }

      throw new Error(response.data.error || "Failed to duplicate portfolio");
    } catch (error) {
      devLog.error("Error duplicating portfolio:", error);
      throw error;
    }
  }
}

export const templatesService = new TemplatesService();
