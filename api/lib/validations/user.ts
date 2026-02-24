import { z } from "zod";
import { safeString, sanitize } from "./zod-helper";

/**
 * Zod schema to validate user update input data.
 * All fields are optional to allow partial updates.
 */
export const userSchema = z.object({
  // Optional email, must be valid if provided
  email: z.string().email("Invalid email address").transform(sanitize),

  // Optional sanitized name, validated using safeString
  name: safeString("Name", 2, 50).transform(sanitize),

  role: z.enum(["admin", "user"]).optional(),

  plan: z.enum(["free", "premium"]).optional(),
});

/**
 * TypeScript type inferred from the Zod userSchema.
 * Useful for type-safe function parameters and API inputs.
 */
export type UserUpdateInput = z.infer<typeof userSchema>;
