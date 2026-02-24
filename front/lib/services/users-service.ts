import { getToken } from "@/actions/auth";
import { apiClient } from "@/lib/api-client";

export interface User {
  _id: string;
  clerkId: string;
  email?: string;
  name?: string;
  role: "admin" | "user";
  plan: "free" | "premium";
  status: "active" | "banned" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface GetUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface UpdateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

class UsersService {
  private async getAuthHeaders() {
    const token = await getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getUser(userId: string): Promise<User> {
    const headers = await this.getAuthHeaders();

    const response = await apiClient.get<GetUserResponse>(
      `/api/user/${userId}`,
      { headers }
    );

    if (response.data.success) {
      return response.data.user;
    }

    throw new Error(response.data.message || "Failed to update user");
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<UpdateUserResponse>(
      `/api/user/${userId}`,
      data
    );

    if (!response.data.success) {
      return response.data.user;
    }

    throw new Error(response.data.message || "Failed to update user");
  }
}

export const usersService = new UsersService();
