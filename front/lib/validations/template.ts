import { z } from "zod";
import { hexColor, safeString } from "./zod-helper";

export const templateSchema = z
  .object({
    title: safeString("Title", 1, 100),
    description: safeString("Description", 1, 1000),
    tags: z
      .array(safeString("Tag", 1, 50))
      .min(1, "At least one tag is required"),
    thumbnail: z
      .string()
      .url("Thumbnail must be a valid URL")
      .transform((val) => val.trim()),
    font: safeString("Font", 1, 100),
    primaryColor: hexColor,
    secondaryColor: hexColor,
    premium: z.boolean(),
    status: z.enum(["active", "inactive"]),
  })
  .strict();

export const updateTemplateSchema = templateSchema.partial().strict();

export type TemplateFormData = z.infer<typeof templateSchema>;
export type UpdateTemplateFormData = z.infer<typeof updateTemplateSchema>;
