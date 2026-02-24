import type React from "react";
/**
 * Type definitions for landing page components
 * Provides type safety and better developer experience
 */

// Props interface for ErrorBoundary component
export interface ErrorBoundaryProps {
  /** React children wrapped by the error boundary */
  children: React.ReactNode;
  /** Fallback UI to display when an error occurs */
  fallback?: React.ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// User data interface for type safety
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Display name of the user */
  name: string;
  /** URL to user's avatar image */
  avatar: string;
  /** User's professional title */
  title: string;
  /** Current online status */
  isOnline: boolean;
}

// Props interface for Hero component
export interface HeroProps {
  /** Total number of registered users - should be a positive integer */
  usersCount: number;
}

// Props interface for Header component
export interface HeaderProps {
  /** Optional CSS class name for styling customization */
  className?: string;
}

// SEO metadata interface for better type safety
// SEO metadata interface for better type safety
export interface SEOMetadata {
  /** Page title for SEO */
  title: string;
  /** Page description for SEO */
  description: string;
  /** Page locale for internationalization */
  locale: string;
  siteName?: string;

  /** Extra optional metadata */
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    type: "website";
    locale: string;
    url: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter?: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
  icons?: {
    icon: string;
  };
  alternates?: {
    languages: Record<string, string>;
  };
}

// Error boundary state interface
export interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** Error message if available */
  error?: Error;
}

export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Internationalization key for the label */
  labelKey: string;
  /** Default fallback text if translation fails */
  defaultLabel: string;
  /** URL path for the navigation item */
  href: string;
  /** Whether this link opens in a new tab */
  external?: boolean;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AuthState {
  /** Whether user authentication is loaded */
  isLoaded: boolean;
  /** Whether user is signed in */
  isSignedIn: boolean;
  /** User data if available */
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    emailAddresses: Array<{ emailAddress: string }>;
    imageUrl?: string;
  };
}

export interface MobileMenuState {
  /** Whether mobile menu is open */
  isOpen: boolean;
  /** Function to toggle menu state */
  toggle: () => void;
  /** Function to close menu */
  close: () => void;
}

export interface FooterLink {
  /** Unique identifier */
  id: string;
  /** Internationalization key */
  labelKey: string;
  /** URL or path */
  href: string;
  /** Whether link opens externally */
  external?: boolean;
  /** Optional accessibility label */
  ariaLabel?: string;
}

export interface ComponentError {
  /** Error message */
  message: string;
  /** Error code if available */
  code?: string;
  /** Component where error occurred */
  component: string;
  /** Timestamp of error */
  timestamp: Date;
}

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  /** Current theme */
  theme: Theme;
  /** Function to set theme */
  setTheme: (theme: Theme) => void;
}
