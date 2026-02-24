export interface Portfolio {
  _id: string;
  userId: string;
  name: string;
  templateId: string;
  slug: string;
  profile: PortfolioProfile;
  skills: Skill[];
  certifications: Certification[];
  experiences: Experience[];
  projects: Project[];
  settings: PortfolioSettings;
  status: "draft" | "published" | "archived";
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  platform: string;
  url: string;
  username?: string;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  bio: string;
  location?: string;
  email: string;
  phone?: string;
  website?: string;
  profilePhoto?: string;
  socialMedia: SocialMedia[];
}

export interface PortfolioSettings {
  isPublic: boolean;
  allowComments: boolean;
  showContactInfo: boolean;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "devops" | "database" | "tools" | "other";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Certification {
  name: string;
  provider: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Request/Response interfaces for API
export interface CreatePortfolioRequest {
  userId: string;
  name: string;
  templateId: string;
  slug?: string;
  profile: PortfolioProfile;
  skills: Skill[];
  certifications: Certification[] | [];
  experiences: Experience[];
  projects: Project[];
  settings: PortfolioSettings;
}
export interface Project {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  isFeatured: boolean;
  completedDate?: Date;
}

export interface UpdatePortfolioRequest
  extends Partial<CreatePortfolioRequest> {
  id: string;
  status?: "draft" | "published" | "archived";
}

export interface PortfolioFilters {
  status?: "draft" | "published" | "archived";
  templateId?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "viewCount" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PortfolioResponse {
  portfolios: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
