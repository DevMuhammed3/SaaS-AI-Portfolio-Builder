import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { showToast } from "./toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatDatePeriod(
  startDate: Date | string,
  endDate?: Date | string,
  isCurrent?: boolean
): string {
  const start = new Date(startDate);
  const end = !isCurrent && endDate ? new Date(endDate) : null; // ✅ Only use endDate if not current

  const format = (date: Date) =>
    `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

  const startStr = format(start);
  const endStr = isCurrent ? "Present" : end ? format(end) : "Present";

  return `${startStr} - ${endStr}`;
}

export const devLog = {
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") console.info(...args);
  },
};
