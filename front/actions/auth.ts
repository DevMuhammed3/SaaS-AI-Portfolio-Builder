"use server";
import { auth } from "@clerk/nextjs/server";

export async function getToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken();
  return token || "";
}
