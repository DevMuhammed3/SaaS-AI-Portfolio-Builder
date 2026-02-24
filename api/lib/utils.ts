import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { showToast } from "./toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Helper functions
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50);
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
};
interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Handles API errors and displays appropriate toast messages
 * @param err - The error object from the API call
 */
export const handleApiError = (err: unknown) => {
  const error = err as AxiosError<{
    message?: string;
    errors?: Record<string, string[]>;
  }>;

  const apiErrors = error.response?.data?.errors;
  const message = error.response?.data?.message;

  if (apiErrors && typeof apiErrors === "object") {
    Object.entries(apiErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((msg) => showToast.error(`${field}: ${msg}`));
      }
    });
  } else {
    showToast.error(message || "An unknown error occurred");
  }
};

export function generateEmailTemplate({
  name,
  email,
  subject,
  message,
}: ContactEmailProps): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
      <h2 style="color: #222222; font-size: 24px; margin-bottom: 16px;">📬 New Contact Message</h2>
      
      <p style="margin: 8px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(
        email
      )}" style="color: #007BFF;">${escapeHtml(email)}</a></p>
      <p style="margin: 8px 0;"><strong>Subject:</strong> ${escapeHtml(
        subject
      )}</p>

      <div style="margin-top: 24px;">
        <strong>Message:</strong>
        <div style="white-space: pre-line; margin-top: 8px; background-color: #f7f7f7; padding: 16px; border-left: 4px solid #007BFF; border-radius: 4px;">
          ${escapeHtml(message)}
        </div>
      </div>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />

      <footer style="font-size: 13px; color: #888888; text-align: center;">
        This message was sent via your portfolio contact form.
        <br /><br />
        <a href="https://10minportfolio.app" style="text-decoration: none; color: #007BFF; font-weight: bold;">
          <img src="https://10minportfolio.app/images/logo.png" alt="10minportfolio.app Logo" style="height: 20px; vertical-align: middle; margin-right: 6px;" />
          10minportfolio.app
        </a>
      </footer>
    </div>
  `;
}

// Sanitize input to prevent XSS
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export const devLog = {
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.error(...args);
  },
};