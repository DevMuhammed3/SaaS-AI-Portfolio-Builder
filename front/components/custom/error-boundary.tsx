/**
 * Enhanced Error Boundary Component
 * Comprehensive error handling with recovery mechanisms and specialized fallbacks
 */

"use client"

import type React from "react"
import { Component } from "react"
import type { ErrorBoundaryState, ErrorBoundaryProps, EnhancedError } from "@/types/error-boundary"
import { getErrorFallback } from "./error-fallbacks"
import { devLog } from "@/lib/utils"

/**
 * Enhanced Error Boundary Class Component
 * Provides comprehensive error handling with recovery and specialized fallbacks
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
    }
  }

  /**
   * Static method to update state when error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const enhancedError: EnhancedError = {
      ...error,
      category: ErrorBoundary.categorizeError(error),
      severity: ErrorBoundary.determineSeverity(error),
      recoverable: ErrorBoundary.isRecoverable(error),
      userMessage: ErrorBoundary.getUserMessage(error),
    }

    return {
      hasError: true,
      error: enhancedError,
      isRetrying: false,
    }
  }

  /**
   * Categorize error based on message and type
   */
  private static categorizeError(error: Error): EnhancedError["category"] {
    const message = error.message.toLowerCase()

    if (message.includes("network") || message.includes("fetch")) {
      return "network"
    }
    if (message.includes("auth") || message.includes("unauthorized")) {
      return "authentication"
    }
    if (message.includes("forbidden") || message.includes("permission")) {
      return "authorization"
    }
    if (message.includes("security") || message.includes("xss")) {
      return "security"
    }
    if (message.includes("validation") || message.includes("invalid")) {
      return "validation"
    }

    return "rendering"
  }

  /**
   * Determine error severity
   */
  private static determineSeverity(error: Error): EnhancedError["severity"] {
    const message = error.message.toLowerCase()

    if (message.includes("security") || message.includes("critical")) {
      return "critical"
    }
    if (message.includes("auth") || message.includes("network")) {
      return "high"
    }
    if (message.includes("validation") || message.includes("render")) {
      return "medium"
    }

    return "low"
  }

  /**
   * Check if error is recoverable
   */
  private static isRecoverable(error: Error): boolean {
    const message = error.message.toLowerCase()

    // Security errors are typically not recoverable
    if (message.includes("security") || message.includes("forbidden")) {
      return false
    }

    // Network and temporary errors are usually recoverable
    return true
  }

  /**
   * Get user-friendly error message
   */
  private static getUserMessage(error: Error): string {
    const category = ErrorBoundary.categorizeError(error)

    switch (category) {
      case "network":
        return "Connection problem. Please check your internet and try again."
      case "authentication":
        return "Please sign in to continue."
      case "authorization":
        return "You don't have permission to access this content."
      case "security":
        return "A security issue was detected. This action has been blocked."
      case "validation":
        return "Invalid data detected. Please check your input and try again."
      default:
        return "Something went wrong. Please try again or contact support."
    }
  }

  /**
   * Lifecycle method called when error occurs
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const enhancedError = this.state.error || (error as EnhancedError)

    // Enhanced logging with context
    devLog.error(`[ErrorBoundary:${this.props.boundaryId || "unknown"}] Error caught:`, {
      error: enhancedError,
      errorInfo,
      category: enhancedError.category,
      severity: enhancedError.severity,
      recoverable: enhancedError.recoverable,
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })

    // Update state with error info
    this.setState({ errorInfo })

    // Call optional error callback
    this.props.onError?.(enhancedError, errorInfo)

    // Report to external service in production
    if (process.env.NODE_ENV === "production") {
      this.reportError(enhancedError, errorInfo)
    }
  }

  /**
   * Report error to external service
   */
  private reportError(error: EnhancedError, errorInfo: React.ErrorInfo) {
    try {
      // In a real app, send to error reporting service like Sentry
      const errorReport = {
        message: error.message,
        stack: error.stack,
        category: error.category,
        severity: error.severity,
        componentStack: errorInfo.componentStack,
        boundaryId: this.props.boundaryId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }

      // Example: Send to error reporting service
      // errorReportingService.captureException(errorReport)

      devLog.info("[ErrorBoundary] Error reported:", errorReport)
    } catch (reportingError) {
      devLog.error("[ErrorBoundary] Failed to report error:", reportingError)
    }
  }

  /**
   * Handle retry action with exponential backoff
   */
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount >= maxRetries) {
      devLog.warn("[ErrorBoundary] Maximum retry attempts reached")
      return
    }

    this.setState({ isRetrying: true })

    // Exponential backoff: 1s, 2s, 4s, etc.
    const delay = Math.pow(2, retryCount) * 1000

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
        isRetrying: false,
      })

      // Call recovery callback
      this.props.onRecover?.()

      devLog.info(`[ErrorBoundary] Retry attempt ${retryCount + 1}`)
    }, delay)
  }

  /**
   * Cleanup on unmount
   */
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { maxRetries = 3, showRetry = true, fallback, boundaryId } = this.props

      const { error, errorInfo, retryCount, isRetrying } = this.state

      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Get appropriate fallback component based on error category
      const FallbackComponent = getErrorFallback(error.category)
      const canRetry = showRetry && error.recoverable !== false && !isRetrying

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            onRetry={this.handleRetry}
            canRetry={canRetry}
            retryCount={retryCount}
            maxRetries={maxRetries}
            boundaryId={boundaryId}
          />
        </div>
      )
    }

    return this.props.children
  }
}
