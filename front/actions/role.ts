import { auth, clerkClient } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";

export async function getUserRole() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return "user";
    }

    const clerkAwait = await clerkClient();
    const clerk = await clerkAwait.users.getUser(userId);

    return (clerk.privateMetadata.role as string) || "user";
  } catch (error) {
    devLog.error("Error getting user role:", error);
    return "user";
  }
}
