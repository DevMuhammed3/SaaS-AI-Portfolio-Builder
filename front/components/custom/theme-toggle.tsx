"use client";

import React from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="hidden md:block">
      <button
        className="border rounded-full p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white dark:bg-gray-700"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 hover:animate-jump hover:animate-once " />
        ) : (
          <Moon className="h-4 w-4 hover:animate-jump hover:animate-once" />
        )}
      </button>
    </div>
  );
};
