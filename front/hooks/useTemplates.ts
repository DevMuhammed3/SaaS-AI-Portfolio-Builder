import { useState, useEffect, useCallback } from "react";
import {
  templatesService,
  type Template,
  type CreateTemplateData,
  type UpdateTemplateData,
} from "@/lib/services/templates-services";
import { showToast } from "@/lib/toast";
import { devLog } from "@/lib/utils";

interface UseTemplatesOptions {
  page?: number;
  limit?: number;
  status?: "active" | "inactive" | "all";
  search?: string;
  tags?: string[];
  premium?: boolean;
}

interface UseTemplatesReturn {
  templates: Template[];
  userTemplates: Template[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  // Actions
  fetchUserTemplates: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: CreateTemplateData) => Promise<Template>;
  updateTemplate: (_id: string, data: UpdateTemplateData) => Promise<Template>;
  deleteTemplate: (_id: string) => Promise<void>;
  duplicateTemplate: (_id: string) => Promise<Template>;
  // Filters
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: "active" | "inactive" | "all") => void;
  setTags: (tags: string[]) => void;
  setPremium: (premium: boolean | undefined) => void;
  clearFilters: () => void;
  // Utils
  refreshTemplates: () => Promise<void>;
}

export function useTemplates(
  initialOptions: UseTemplatesOptions = {}
): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [page, setPageState] = useState(initialOptions.page || 1);
  const [search, setSearchState] = useState(initialOptions.search || "");
  const [status, setStatusState] = useState<"active" | "inactive" | "all">(
    initialOptions.status || "all"
  );
  const [tags, setTagsState] = useState<string[]>(initialOptions.tags || []);
  const [premium, setPremiumState] = useState<boolean | undefined>(
    initialOptions.premium
  );

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const filters = {
        page,
        limit: initialOptions.limit || 10,
        ...(status !== "all" && { status }),
        ...(search && { search }),
        ...(tags.length > 0 && { tags }),
        ...(premium !== undefined && { premium }),
      };

      const response = await templatesService.getAllTemplates(filters);

      setTemplates(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasNextPage: response.page < response.totalPages,
        hasPrevPage: response.page > 1,
      });
    } catch (err) {
      devLog.error("Error fetching templates:", err);
      setIsError(true);
      setError(
        err instanceof Error ? err.message : "Failed to fetch templates"
      );
      showToast.error("Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, tags, premium, initialOptions.limit]);

  const fetchUserTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const filters = {
        page,
        limit: initialOptions.limit || 10,
        ...(status !== "all" && { status }),
        ...(search && { search }),
        ...(tags.length > 0 && { tags }),
        ...(premium !== undefined && { premium }),
      };

      const response = await templatesService.getAllUserTemplates(filters);

      setUserTemplates(response.data);
      setTemplates(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        hasNextPage: response.page < response.totalPages,
        hasPrevPage: response.page > 1,
      });
    } catch (err) {
      devLog.error("Error fetching templates:", err);
      setIsError(true);
      setError(
        err instanceof Error ? err.message : "Failed to fetch templates"
      );
      showToast.error("Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, tags, premium, initialOptions.limit]);

  const createTemplate = useCallback(
    async (data: CreateTemplateData): Promise<Template> => {
      try {
        setIsLoading(true);
        const newTemplate = await templatesService.createTemplate(data);

        // Add to the beginning of the list
        setTemplates((prev) => [newTemplate, ...prev]);

        // Update pagination
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));

        showToast.success("Template created successfully");
        return newTemplate;
      } catch (err) {
        devLog.error("Error creating template:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create template";
        showToast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateTemplate = useCallback(
    async (_id: string, data: UpdateTemplateData): Promise<Template> => {
      try {
        setIsLoading(true);
        const updatedTemplate = await templatesService.updateTemplate(
          _id,
          data
        );

        // Update in the list
        setTemplates((prev) =>
          prev.map((template) =>
            template._id === _id ? updatedTemplate : template
          )
        );

        showToast.success("Template updated successfully");
        return updatedTemplate;
      } catch (err) {
        devLog.error("Error updating template:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update template";
        showToast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteTemplate = useCallback(async (_id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await templatesService.deleteTemplate(_id);

      // Remove from the list
      setTemplates((prev) => prev.filter((template) => template._id !== _id));

      // Update pagination
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      showToast.success("Template deleted successfully");
    } catch (err) {
      devLog.error("Error deleting template:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete template";
      showToast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const duplicateTemplate = useCallback(
    async (_id: string): Promise<Template> => {
      try {
        setIsLoading(true);
        const duplicatedTemplate = await templatesService.duplicateTemplate(
          _id
        );

        // Add to the beginning of the list
        setTemplates((prev) => [duplicatedTemplate, ...prev]);

        // Update pagination
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));

        showToast.success("Template duplicated successfully");
        return duplicatedTemplate;
      } catch (err) {
        devLog.error("Error duplicating template:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to duplicate template";
        showToast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Filter setters
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setPageState(1); // Reset to first page when searching
  }, []);

  const setStatus = useCallback((newStatus: "active" | "inactive" | "all") => {
    setStatusState(newStatus);
    setPageState(1); // Reset to first page when filtering
  }, []);

  const setTags = useCallback((newTags: string[]) => {
    setTagsState(newTags);
    setPageState(1); // Reset to first page when filtering
  }, []);

  const setPremium = useCallback((newPremium: boolean | undefined) => {
    setPremiumState(newPremium);
    setPageState(1); // Reset to first page when filtering
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState("");
    setStatusState("all");
    setTagsState([]);
    setPremiumState(undefined);
    setPageState(1);
  }, []);

  const refreshTemplates = useCallback(async () => {
    await fetchTemplates();
    await fetchUserTemplates();
  }, [fetchTemplates, fetchUserTemplates]);

  // Fetch templates when filters change
  useEffect(() => {
    //  fetchTemplates();
    fetchUserTemplates();
  }, [fetchTemplates, fetchUserTemplates]);

  return {
    templates,
    isLoading,
    isError,
    error,
    pagination,
    // Actions
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    // Filters
    setPage,
    setSearch,
    setStatus,
    setTags,
    setPremium,
    clearFilters,
    // Utils
    refreshTemplates,
    userTemplates,
    fetchUserTemplates,
  };
}
