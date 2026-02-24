"use client";

import { TooltipProvider as Tooltip } from "@/components/ui/tooltip";
import React from "react";

export default function TooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Tooltip>{children}</Tooltip>;
}
