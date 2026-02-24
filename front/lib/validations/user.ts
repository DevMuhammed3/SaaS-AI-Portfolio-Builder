import { z } from "zod";
import { safeString } from "./zod-helper";

export const userSettingsSchema = z.object({
  name: safeString("Name", 2, 50),
  email: z.string().email("Please enter a valid email address"),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
