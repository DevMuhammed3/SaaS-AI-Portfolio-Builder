import { z } from "zod";

export function sanitize(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/<[^>]*>?/gm, "") // Remove all HTML tags
    .replace(/[<>]/g, "") // Remove angle brackets (for safety)
    .replace(/&[a-z]+;/gi, "") // Remove encoded HTML entities
    .replace(/[\u0000-\u001F\u007F]/g, "") // Remove control characters
    .replace(/["'()]/g, "") // Remove quotes and parentheses
    .trim() // Trim whitespace
    .slice(0, 1000);
}

export const forbiddenPatterns = [
  /<[^>]*>?/gm, // HTML tags
  /[<>]/g, // angle brackets
  /&[a-z]+;/gi, // encoded HTML entities
  /[\u0000-\u001F\u007F]/g, // control characters,
  /["'()]/g, // Quotes and parentheses
];

export function hasForbiddenChars(value: string): boolean {
  return forbiddenPatterns.some((pattern) => pattern.test(value));
}

export const safeString = (fieldName: string, min = 1, max = 255) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} is required`)
    .max(max, `${fieldName} is too long`);
// .refine((val: string) => !hasForbiddenChars(val), {
//   message: `${fieldName} contains invalid characters or HTML`,
// });
