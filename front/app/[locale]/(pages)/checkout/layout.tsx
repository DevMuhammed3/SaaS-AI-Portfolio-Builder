import { getUserPlan } from "@/actions/user";
import { redirect } from "next/navigation";
import type React from "react";
export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plan = await getUserPlan();
  if (plan === "premium") {
    redirect("/user");
  }
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
