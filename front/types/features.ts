/**
 * TypeScript interfaces for Features page components
 * Provides type safety and better developer experience
 */

import type { LucideIcon } from "lucide-react";
import type { Role } from "./index";

/**
 * Interface for individual feature items displayed on the features page
 */
export interface FeatureItem {
  /** Lucide icon component for the feature */
  icon: LucideIcon;
  /** Display title of the feature */
  title: string;
  /** Detailed description of the feature */
  description: string;
  /** Tailwind gradient classes for the feature icon background */
  color: string;
}

/**
 * Props interface for the FeaturesPage component
 */
export interface FeaturesPageProps {
  /** User role to determine available features and UI elements */
  role: Role;
}

/**
 * Interface for feature card component props
 */
export interface FeatureCardProps {
  /** Feature data to display */
  feature: FeatureItem;
  /** Animation delay for staggered entrance effects */
  index: number;
}

/**
 * Interface for CTA section props
 */
export interface CTASectionProps {
  /** Whether user is currently signed in */
  isSignedIn: boolean;
  /** User role for conditional rendering */
  role: Role;
  /** Navigation function for routing */
  onNavigate: (path: string) => void;
}
