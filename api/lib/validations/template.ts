import { z } from "zod";
import { safeString, sanitize } from "./zod-helper"; // adjust path as needed
import mongoose from "mongoose";

// HEX color validator
const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color");

// Zod schema for creating a new template (all required)
export const templateSchema = z.object({
  title: safeString("Title", 1, 100).transform(sanitize),

  description: safeString("Description", 1, 1000).transform(sanitize),

  tags: z
    .array(safeString("Tag", 1, 50).transform(sanitize))
    .min(1, "At least one tag is required")
    .max(10, "Too many tags"),

  thumbnail: z
    .string()
    .trim()
    .url("Thumbnail must be a valid URL")
    .transform((val) => sanitize(val)),

  font: safeString("Font", 1, 100).transform(sanitize),

  primaryColor: hexColor.transform(sanitize),
  secondaryColor: hexColor.transform(sanitize),

  premium: z.boolean(),

  status: z.enum(["active", "inactive"]),
});
export const idSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid template ID",
  });

export const templateUpdateSchema = templateSchema.partial();

export type TemplateCreateInput = z.infer<typeof templateSchema>;
export type TemplateUpdateInput = z.infer<typeof templateUpdateSchema>;
