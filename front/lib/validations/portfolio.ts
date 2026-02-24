// validation/profile-schema.ts
import { z } from "zod";
import { hasForbiddenChars, safeString } from "./zod-helper";

// Social media schema
export const SocialMediaSchema = z
  .object({
    platform: safeString("Platform", 1, 50).optional(),

    url: z
      .string()
      .trim()
      .url("Invalid URL")
      .optional()
      .refine((val) => val === undefined || !hasForbiddenChars(val), {
        message: "Website contains invalid characters or HTML",
      }),
  })
  .strict(); // prevent unknown keys

// Main profile schema
export const ProfileSchema = z
  .object({
    name: safeString("Name", 1, 100),
    title: safeString("Title", 1, 100),
    bio: safeString("Bio", 10, 500),
    email: z.string().email("Invalid email"),
    phone: safeString("Phone", 1, 20),
    location: safeString("Location", 1, 100),

    website: z
      .string()
      .trim()
      .url("Invalid URL")
      .optional()
      .refine((val) => val === undefined || !hasForbiddenChars(val), {
        message: "Website contains invalid characters or HTML",
      }),

    avatar: safeString("Avatar", 1, 1000), // base64 or image URL

    socialMedia: z.array(SocialMediaSchema).optional(),
  })
  .strict();

export const AchievementSchema = safeString("Achievement", 1, 300);
export const TechnologySchema = safeString("Technology", 0, 40);

// Experience schema
export const ExperienceSchema = z
  .object({
    title: safeString("Job title", 1, 100),
    company: safeString("Company name", 1, 100),
    location: safeString("Location", 1, 100),

    startDate: z.coerce.date({
      invalid_type_error: "Start date must be a valid date",
    }),

    endDate: z
      .union([z.coerce.date(), z.literal(null)])
      .optional()
      .refine((val) => val === null || val instanceof Date, {
        message: "End date must be a valid date or null",
      }),

    isCurrent: z.boolean().default(false),

    description: safeString("Job description", 1, 1000),

    achievements: z.array(AchievementSchema).max(20, "Too many achievements"),

    technologies: z
      .array(safeString("Technology", 1, 50))
      .max(10, "Too many technologies"),
  })
  .strict();

export const ProjectSchema = z
  .object({
    title: safeString("Project title", 1, 100),
    description: safeString("Project description", 1, 1000),
    thumbnail: z.string().trim(), // Optional: You can also wrap this with safeString if you validate it

    technologies: z.array(TechnologySchema).max(10, "Too many achievements"),

    demoUrl: z.string().trim().url("Demo URL must be valid"),
    githubUrl: z.string().trim().url("GitHub URL must be valid"),
    isFeatured: z.boolean().default(false),
    completedDate: z.coerce.date().optional(),
  })
  .strict();

export const PortfolioSettingsSchema = z
  .object({
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
  })
  .strict();

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
