"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { usersService } from "@/lib/services/users-service";
import { useAuth } from "@clerk/nextjs";
import { devLog } from "@/lib/utils";

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
  plan?: "free" | "premium";
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { userId } = useAuth();

  const fetchUser = useCallback(async () => {
    if (!userId) {
      console.warn("No userId found in auth context");
      return;
    }
    try {
      setLoading(true);
      const userData = await usersService.getUser(userId);
      setUser(userData);
    } catch (error) {
      devLog.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateUser = useCallback(
    async (data: UpdateUserData) => {
      try {
        setUpdating(true);
        if (!userId) {
          console.warn("No userId found in auth context");
          return;
        }
        const updatedUser = await usersService.updateUser(userId, data);
        setUser(updatedUser);
        toast.success("Profile updated successfully!");
      } catch (error) {
        devLog.error("Error updating user:", error);
        toast.error("Failed to update profile");
      } finally {
        setUpdating(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    updating,
    fetchUser,
    updateUser,
  };
}
