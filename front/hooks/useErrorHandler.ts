"use client";

/**
 * Custom hook for centralized error handling
 * Provides consistent error logging and user feedback
 */

import { useCallback, useState } from "react";
import type { ComponentError } from "@/types/landing";

interface UseErrorHandlerReturn {
  /** Current error state */
  error: ComponentError | null;
  /** Function to handle and log errors */
  handleError: (error: Error, component: string, code?: string) => void;
  /** Function to clear current error */
  clearError: () => void;
  /** Whether component has an error */
  hasError: boolean;
}

/**
 * Hook for handling errors in components
 * @returns Error handling utilities
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<ComponentError | null>(null);

  const handleError = useCallback(
    (error: Error, component: string, code?: string) => {
      const componentError: ComponentError = {
        message: error.message,
        code,
        component,
        timestamp: new Date(),
      };

      // Log error for debugging
      console.error(`[${component}] Error:`, {
        message: error.message,
        code,
        stack: error.stack,
        timestamp: componentError.timestamp,
      });

      // Set error state for UI feedback
      setError(componentError);

      // In production, send to error reporting service
      if (process.env.NODE_ENV === "production") {
        // Example: Send to Sentry, LogRocket, etc.
        // errorReportingService.captureException(error, { component, code });
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
}
