/**
 * Specialized Error Fallback Components
 * Provides different UI for various error scenarios
 */

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Wifi, Shield, Lock, AlertCircle, Home, Mail } from "lucide-react"
import type { ErrorFallbackProps, ErrorCategory } from "@/types/error-boundary"
import { LocaleLink } from "@/components/custom/locale-link"

/**
 * Network Error Fallback Component
 */
export function NetworkErrorFallback({ onRetry, canRetry, retryCount, maxRetries }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Wifi className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle>Connection Problem</CardTitle>
        <CardDescription>
          Unable to connect to our servers. Please check your internet connection and try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {canRetry && (
          <Button onClick={onRetry} className="w-full" disabled={retryCount >= maxRetries}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : "Try Again"}
          </Button>
        )}
        <Button variant="outline" asChild className="w-full bg-transparent">
          <LocaleLink href="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </LocaleLink>
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Authentication Error Fallback Component
 */
export function AuthErrorFallback({ onRetry, canRetry }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>
          You need to be signed in to access this content. Please sign in and try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Button asChild className="w-full">
          <LocaleLink href="/sign-in">Sign In</LocaleLink>
        </Button>
        {canRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Security Error Fallback Component
 */
export function SecurityErrorFallback() {
  return (
    <Card className="max-w-md mx-auto border-destructive">
      <CardHeader className="text-center">
        <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
        <CardTitle className="text-destructive">Security Issue Detected</CardTitle>
        <CardDescription>
          A security issue was detected. For your protection, this action has been blocked.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Button variant="outline" asChild className="w-full bg-transparent">
          <LocaleLink href="/">
            <Home className="w-4 h-4 mr-2" />
            Return to Safety
          </LocaleLink>
        </Button>
        <Button variant="outline" asChild className="w-full bg-transparent">
          <a href="mailto:security@example.com?subject=Security Issue Report">
            <Mail className="w-4 h-4 mr-2" />
            Report Issue
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Generic Error Fallback Component
 */
export function GenericErrorFallback({
  error,
  onRetry,
  canRetry,
  retryCount,
  maxRetries,
  boundaryId,
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <CardTitle>Something Went Wrong</CardTitle>
        <CardDescription>
          {error.userMessage ||
            "We encountered an unexpected error. Please try again or contact support if the problem persists."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {canRetry && (
          <Button onClick={onRetry} className="w-full" disabled={retryCount >= maxRetries}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : "Try Again"}
          </Button>
        )}
        <div className="flex gap-2">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <LocaleLink href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </LocaleLink>
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <LocaleLink href="/help">
              <AlertCircle className="w-4 h-4 mr-2" />
              Help
            </LocaleLink>
          </Button>
        </div>
        {isDevelopment && boundaryId && (
          <details className="text-left text-sm text-muted-foreground">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              Boundary: {boundaryId}
              {"\n"}
              Error: {error.message}
              {"\n"}
              Stack: {error.stack}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Get appropriate fallback component based on error category
 */
export function getErrorFallback(category?: ErrorCategory) {
  switch (category) {
    case "network":
      return NetworkErrorFallback
    case "authentication":
      return AuthErrorFallback
    case "security":
      return SecurityErrorFallback
    default:
      return GenericErrorFallback
  }
}
