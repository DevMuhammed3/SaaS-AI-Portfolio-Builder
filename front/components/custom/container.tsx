import { cn } from "@/lib/utils";
import type React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
  as?: React.ElementType;
  className?: string;
}

function Container({
  children,
  fluid = false,
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "container mx-auto h-full px-4",
        fluid ? "max-w-full" : "max-w-6xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
