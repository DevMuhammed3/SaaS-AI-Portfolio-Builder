import { safeString } from "./zod-helper";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: safeString("Name", 2, 50),

  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase()),

  subject: safeString("Subject", 5, 100),

  message: safeString("Message", 10, 500),
});

export type contactFormInput = z.infer<typeof contactFormSchema>;
