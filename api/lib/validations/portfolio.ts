import { z } from "zod";
import { safeString, sanitize } from "./zod-helper";

// Enums
const SkillCategoryEnum = z.enum([
  "frontend",
  "backend",
  "devops",
  "database",
  "tools",
  "other",
]);

const ProficiencyEnum = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

const ProfileStatusEnum = z.enum(["draft", "publish", "archived"]);

const PortfolioStatusEnum = z.enum(["draft", "published", "archived"]);

// Subschemas
const SocialMediaSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required"),
  url: z.string().trim().url("Social media Invalid URL format"),
  username: z.string().trim().optional(),
});

const SkillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required"),
  category: SkillCategoryEnum,
  proficiency: ProficiencyEnum,
});

const CertificationSchema = z.object({
  name: z.string().trim().min(1, "Certification name is required"),
  provider: z.string().min(1, "Provider is required"), // Originally enum, now relaxed to string
  issueDate: z.coerce
    .date({
      required_error: "Issue date is required",
      invalid_type_error: "Invalid issue date",
    })
    .optional(),
  expiryDate: z.coerce.date().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Invalid credential URL").optional(),
});

const ExperienceSchema = z.object({
  title: z.string().trim().min(1, "Job title is required"),
  company: z.string().trim().min(1, "Company name is required"),
  location: z.string().trim().optional(),
  startDate: z.coerce
    .date()
    .refine((val) => val === null || val instanceof Date, {
      message: "End date must be a valid date or null",
    }),
  endDate: z
    .union([z.coerce.date(), z.literal(null)])
    .optional()
    .refine((val) => val === null || val instanceof Date, {
      message: "End date must be a valid date or null",
    }),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().min(1, "Job description is required"),
  achievements: z.array(z.string().trim()),
  technologies: z.array(z.string()),
});

const ProjectSchema = z.object({
  title: z.string().trim().min(1, "Project title is required"),
  description: z.string().trim().min(1, "Project description is required"),
  thumbnail: z.string().trim(),
  technologies: z
    .array(z.string().trim())
    .min(1, "At least one technology is required"),
  demoUrl: z.string().trim().url("Demo URL must be valid"),
  githubUrl: z.string().trim().url("GitHub URL must be valid"),
  isFeatured: z.boolean().default(false),
  completedDate: z.coerce.date().optional(),
});

export const PortfolioProfileSchema = z.object({
  name: safeString("Name", 1, 100).transform(sanitize),

  title: safeString("Title", 1, 200).transform(sanitize),

  bio: safeString("Bio", 1, 500).transform(sanitize),

  location: safeString("Location", 1, 100)
    .optional()
    .transform((val) => (val ? sanitize(val) : val)),

  email: z.string().trim().email("Invalid email format"),

  phone: z.string().trim().optional(),

  website: z
    .string()
    .trim()
    .url("Website must be a valid URL")
    .max(500, "Website must be less than 500 characters")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? "" : sanitize(val ?? ""))),

  profilePhoto: z
    .string()
    .trim()
    .optional()
    .refine((val) => val === undefined || val.length > 0, {
      message: "profilePhoto cannot be an empty string",
    }),

  socialMedia: z.array(SocialMediaSchema).max(5, "Too many social medias"),

  status: ProfileStatusEnum.default("draft"),
});

export const PortfolioSettingsSchema = z.object({
  isPublic: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
  customDomain: z.string().trim().optional(),
  seoTitle: z
    .string()
    .max(60, "SEO title must be 60 characters or less")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description must be 160 characters or less")
    .optional(),
});

// Main Portfolio Schema
export const createPortfolioSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Portfolio name is required"),
  templateId: z.string().min(1, "Template ID is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(50, "Slug must be less than 50 characters long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  profile: PortfolioProfileSchema,
  skills: z.array(SkillSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  experiences: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  settings: PortfolioSettingsSchema.default({}),
  status: PortfolioStatusEnum.default("draft"),
  viewCount: z.number().int().min(0).default(0),
});

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  id: z.string().min(1, "Portfolio ID is required"),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters long")
  .max(50, "Slug must be less than 50 characters long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens"
  );

export type PortfolioInput = z.infer<typeof createPortfolioSchema>;
export type PortfolioUpdate = z.infer<typeof updatePortfolioSchema>;
