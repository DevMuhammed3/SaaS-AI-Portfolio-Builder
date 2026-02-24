/**
 * Enhanced TypeScript interfaces for error boundary components
 * Provides comprehensive error handling and recovery mechanisms
 */

import type { ReactNode, ErrorInfo } from "react";

/**
 * Error severity levels for categorization
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Error categories for better handling
 */
export type ErrorCategory =
  | "network"
  | "authentication"
  | "authorization"
  | "validation"
  | "rendering"
  | "security"
  | "performance";

/**
 * Enhanced error information interface
 */
export interface EnhancedError extends Error {
  /** Error category for specialized handling */
  category?: ErrorCategory;
  /** Error severity level */
  severity?: ErrorSeverity;
  /** Additional context data */
  context?: Record<string, unknown>;
  /** User-friendly error message */
  userMessage?: string;
  /** Whether error can be recovered from */
  recoverable?: boolean;
  /** Retry count for recovery attempts */
  retryCount?: number;
}

/**
 * Error boundary state interface
 */
export interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error?: EnhancedError;
  /** Error info from React */
  errorInfo?: ErrorInfo;
  /** Number of retry attempts */
  retryCount: number;
  /** Whether currently retrying */
  isRetrying: boolean;
}

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI component */
  fallback?: ReactNode;
  /** Error callback function */
  onError?: (error: EnhancedError, errorInfo: ErrorInfo) => void;
  /** Recovery callback function */
  onRecover?: () => void;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Whether to show error details in development */
  showErrorDetails?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Error boundary identifier for logging */
  boundaryId?: string;
}

/**
 * Fallback component props interface
 */
export interface ErrorFallbackProps {
  /** The error that occurred */
  error: EnhancedError;
  /** Error info from React */
  errorInfo?: ErrorInfo;
  /** Retry function */
  onRetry: () => void;
  /** Whether retry is available */
  canRetry: boolean;
  /** Number of retry attempts */
  retryCount: number;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Boundary identifier */
  boundaryId?: string;
}
