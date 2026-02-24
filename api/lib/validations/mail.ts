import { z } from "zod";
import { safeString, sanitize } from "./zod-helper";

export const contactFormSchema = z.object({
  name: safeString("Name", 2, 50).transform(sanitize),

  email: z.string().email({ message: "Invalid email address" }),

  subject: safeString("Subject", 5, 100).transform(sanitize),

  message: safeString("Message", 10, 1000).transform(sanitize),
});
export type contactFormInput = z.infer<typeof contactFormSchema>;
