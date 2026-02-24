"use client";

import { useState, useCallback } from "react";

import {
  CreatePortfolioRequest,
  Portfolio,
  PortfolioFilters,
  portfoliosService,
  UpdatePortfolioRequest,
} from "@/lib/services/portfolios-service";
import { showToast } from "@/lib/toast";

export interface UsePortfoliosReturn {
  // State
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchPortfolios: (filters?: PortfolioFilters) => Promise<void>;
  fetchPublicPortfolios: (filters?: PortfolioFilters) => Promise<void>;
  fetchPortfolioById: (id: string) => Promise<void>;
  fetchPortfolioBySlug: (slug: string) => Promise<Portfolio | null>;
  createPortfolio: (
    portfolioData: CreatePortfolioRequest
  ) => Promise<Portfolio | null>;
  updatePortfolio: (
    id: string,
    portfolioData: Partial<UpdatePortfolioRequest>
  ) => Promise<Portfolio | null>;
  duplicatePortfolio: (id: string) => Promise<Portfolio | null>;
  deletePortfolio: (id: string) => Promise<boolean>;
  publishPortfolio: (id: string) => Promise<Portfolio | null>;
  unpublishPortfolio: (id: string) => Promise<Portfolio | null>;
  archivePortfolio: (id: string) => Promise<Portfolio | null>;
  validateSlug: (
    slug: string,
    excludeId?: string
  ) => Promise<{ isValid: boolean; message?: string }>;

  // Utility
  clearError: () => void;
  setCurrentPortfolio: (portfolio: Portfolio | null) => void;
}

// Custom React Hook that handles portfolio logic
export function usePortfolios(): UsePortfoliosReturn {

  // React states to manage our data
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

// Clears any existing error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  console.log("Selected Portfolio:", portfolios);
  const fetchPortfolios = useCallback(
    async (filters: PortfolioFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await portfoliosService.getPortfolios(filters);

        setPortfolios(response.portfolios);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch portfolios";
        setError(errorMessage);
        showToast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchPublicPortfolios = useCallback(
    async (filters: PortfolioFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await portfoliosService.getPublicPortfolios(filters);

        setPortfolios(response.portfolios);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch portfolios";
        setError(errorMessage);
        showToast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchPortfolioById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const portfolio = await portfoliosService.getPortfolioById(id);
      setCurrentPortfolio(portfolio);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch portfolio";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPortfolioBySlug = useCallback(
    async (slug: string): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const portfolio = await portfoliosService.getPortfolioBySlug(slug);
        return portfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch portfolio";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createPortfolio = useCallback(
    async (
      portfolioData: CreatePortfolioRequest
    ): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const newPortfolio = await portfoliosService.createPortfolio(
          portfolioData
        );

        // Add to portfolios list
        if (newPortfolio) {
          setPortfolios((prev) => [newPortfolio, ...prev]);
        }
        return newPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updatePortfolio = useCallback(
    async (
      id: string,
      portfolioData: Partial<UpdatePortfolioRequest>
    ): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedPortfolio = await portfoliosService.updatePortfolio(
          id,
          portfolioData
        );

        // Update in portfolios list
        if (updatedPortfolio) {
          setPortfolios((prev) =>
            prev.map((portfolio) =>
              portfolio._id === id ? updatedPortfolio : portfolio
            )
          );
        }

        // Update current portfolio if it's the same
        if (currentPortfolio && currentPortfolio?._id === id) {
          setCurrentPortfolio(updatedPortfolio);
        }

        return updatedPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentPortfolio]
  );

  const duplicatePortfolio = useCallback(
    async (id: string): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const duplicatedPortfolio = await portfoliosService.duplicatePortfolio(
          id
        );

        // Add to portfolios list
        setPortfolios((prev) => [duplicatedPortfolio, ...prev]);

        showToast.success("Portfolio duplicated successfully!");
        return duplicatedPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to duplicate portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deletePortfolio = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await portfoliosService.deletePortfolio(id);

        // Remove from portfolios list
        setPortfolios((prev) =>
          prev.filter((portfolio) => portfolio._id !== id)
        );

        // Clear current portfolio if it's the deleted one
        if (currentPortfolio?._id === id) {
          setCurrentPortfolio(null);
        }

        showToast.success("Portfolio deleted successfully!");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentPortfolio]
  );

  const publishPortfolio = useCallback(
    async (id: string): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const publishedPortfolio = await portfoliosService.publishPortfolio(id);
        if (!publishedPortfolio) {
          return null;
        }
        // Update in portfolios list
        setPortfolios((prev) =>
          prev.map((portfolio) =>
            portfolio._id === id ? publishedPortfolio : portfolio
          )
        );

        // Update current portfolio if it's the same
        if (currentPortfolio?._id === id) {
          setCurrentPortfolio(publishedPortfolio);
        }
        return publishedPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to publish portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentPortfolio]
  );

  const unpublishPortfolio = useCallback(
    async (id: string): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const unpublishedPortfolio = await portfoliosService.unpublishPortfolio(
          id
        );

        // Update in portfolios list
        setPortfolios((prev) =>
          prev.map((portfolio) =>
            portfolio._id === id ? unpublishedPortfolio : portfolio
          )
        );

        // Update current portfolio if it's the same
        if (currentPortfolio?._id === id) {
          setCurrentPortfolio(unpublishedPortfolio);
        }

        showToast.success("Portfolio unpublished successfully!");
        return unpublishedPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to unpublish portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentPortfolio]
  );

  const archivePortfolio = useCallback(
    async (id: string): Promise<Portfolio | null> => {
      try {
        setLoading(true);
        setError(null);

        const archivedPortfolio = await portfoliosService.archivePortfolio(id);

        // Update in portfolios list
        setPortfolios((prev) =>
          prev.map((portfolio) =>
            portfolio._id === id ? archivedPortfolio : portfolio
          )
        );

        // Update current portfolio if it's the same
        if (currentPortfolio?._id === id) {
          setCurrentPortfolio(archivedPortfolio);
        }

        showToast.success("Portfolio archived successfully!");
        return archivedPortfolio;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to archive portfolio";
        setError(errorMessage);
        showToast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentPortfolio]
  );

  const validateSlug = useCallback(
    async (
      slug: string,
      excludeId?: string
    ): Promise<{ isValid: boolean; message?: string }> => {
      try {
        return await portfoliosService.validateSlug(slug, excludeId);
      } catch (err) {
        return { isValid: false, message: "Failed to validate slug" + err };
      }
    },
    []
  );

  return {
    // State
    portfolios,
    currentPortfolio,
    loading,
    error,
    pagination,

    // Actions
    fetchPortfolios,
    fetchPublicPortfolios,
    fetchPortfolioById,
    fetchPortfolioBySlug,
    createPortfolio,
    updatePortfolio,
    duplicatePortfolio,
    deletePortfolio,
    publishPortfolio,
    unpublishPortfolio,
    archivePortfolio,
    validateSlug,

    // Utility
    clearError,
    setCurrentPortfolio,
  };
}
