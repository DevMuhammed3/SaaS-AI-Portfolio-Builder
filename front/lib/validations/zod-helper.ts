import { z } from "zod";

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
    .min(min, `${fieldName} is required, at least ${min} characters`)
    .max(max, `${fieldName} is too long`)
    .refine((val: string) => !hasForbiddenChars(val), {
      message: `${fieldName} contains invalid characters or HTML`,
    });

export const hexColor = z
  .string()
  .regex(
    /^#(?:[0-9a-fA-F]{3}){1,2}$/,
    "Must be a valid HEX color (e.g. #000000)"
  );
