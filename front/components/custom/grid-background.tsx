"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
}

export const GridBackground = ({
  children,
  className,
  dotColor = "rgba(102, 90, 240, 0.15)",
  dotSize = 1,
  dotSpacing = 24,
  ...props
}: GridBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center  overflow-hidden w-full",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent 0)`,
          backgroundSize: `${dotSpacing}px ${dotSpacing}px`,
        }}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
