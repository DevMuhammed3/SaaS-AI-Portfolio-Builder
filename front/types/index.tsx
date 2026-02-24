export type Plan = "free" | "premium";
export type Role = "user" | "admin";

export interface Template {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  font: string;
  primaryColor: string;
  secondaryColor: string;
  premium: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}
