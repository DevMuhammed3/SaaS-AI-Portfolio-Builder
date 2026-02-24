import { auth } from "@clerk/nextjs/server";

export async function getToken(): Promise<string> {
  // This should be implemented based on your auth system
  // For Clerk, you might use getToken() from useAuth hook
  // This is a simplified version
  const { getToken } = await auth();
  const token = await getToken();
  return token || "";
}
