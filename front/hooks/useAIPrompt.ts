"use client";

import { useState } from "react";
import {
  aiPromptService,
  type GenerateExperienceRequest,
  type GenerateProfileRequest,
  type GenerateProjectsRequest,
} from "@/lib/services/ai-prompt-service";
import type {
  Experience,
  PortfolioProfile,
  Project,
} from "@/lib/services/portfolios-service";
import { devLog } from "@/lib/utils";

/**
 * Hook for AI-powered data generation
 *
 * Provides functions to generate portfolio data using AI with loading states
 * and error handling.
 */
export function useAIPrompt() {
  const [isGeneratingExperience, setIsGeneratingExperience] = useState(false);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [isGeneratingProjects, setIsGeneratingProjects] = useState(false);

  /**
   * Generate work experience data
   */
  const generateExperience = async (
    request: GenerateExperienceRequest,
    fallbackData?: Experience[]
  ): Promise<Experience[]> => {
    setIsGeneratingExperience(true);

    try {
      const result = await aiPromptService.generateExperience(request);

      if (result.success && result.data) {
        return result.data;
      } else {
        devLog.warn("AI generation failed, using fallback data");
        return fallbackData || getDefaultExperienceData();
      }
    } catch (error) {
      devLog.error("Error in generateExperience:", error);
      return fallbackData || getDefaultExperienceData();
    } finally {
      setIsGeneratingExperience(false);
    }
  };

  /**
   * Generate profile information
   */
  const generateProfile = async (
    request: GenerateProfileRequest,
    fallbackData?: PortfolioProfile
  ): Promise<PortfolioProfile> => {
    setIsGeneratingProfile(true);

    try {
      const result = await aiPromptService.generateProfile(request);

      if (result.success && result.data) {
        return result.data;
      } else {
        devLog.warn("AI generation failed, using fallback data");
        return fallbackData || getDefaultProfileData();
      }
    } catch (error) {
      devLog.error("Error in generateProfile:", error);
      return fallbackData || getDefaultProfileData();
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  /**
   * Generate projects data
   */
  const generateProjects = async (
    request: GenerateProjectsRequest,
    fallbackData?: Project[]
  ): Promise<Project[]> => {
    setIsGeneratingProjects(true);

    try {
      const result = await aiPromptService.generateProjects(request);

      if (result.success && result.data) {
        return result.data;
      } else {
        devLog.warn("AI generation failed, using fallback data");
        return fallbackData || getDefaultProjectsData();
      }
    } catch (error) {
      devLog.error("Error in generateProjects:", error);
      return fallbackData || getDefaultProjectsData();
    } finally {
      setIsGeneratingProjects(false);
    }
  };

  return {
    generateExperience,
    generateProfile,
    generateProjects,
    isGeneratingExperience,
    isGeneratingProfile,
    isGeneratingProjects,
  };
}

// Default fallback data functions
function getDefaultExperienceData(): Experience[] {
  return [
    {
      _id: Date.now().toString(),
      title: "Frontend Developer",
      company: "TechNova",
      location: "San Francisco, CA",
      startDate: new Date("2021-05-01"),
      endDate: new Date("2023-06-01"),
      isCurrent: false,
      description:
        "Worked on building interactive UIs and component systems for scalable SaaS platforms.",
      achievements: [
        "Reduced bundle size by 40% by refactoring shared components",
        "Implemented lazy loading and caching strategy for SPA",
        "Led migration from JavaScript to TypeScript across 3 projects",
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Jest"],
    },
    {
      _id: (Date.now() + 1).toString(),
      title: "Full Stack Engineer",
      company: "CodeWorks",
      location: "Remote",
      startDate: new Date("2019-02-01"),
      endDate: new Date("2021-04-01"),
      isCurrent: false,
      description:
        "Contributed to both frontend and backend development in a high-paced startup environment.",
      achievements: [
        "Built RESTful APIs using Node.js and Express",
        "Integrated third-party services (Stripe, SendGrid)",
        "Developed CI/CD pipeline using GitHub Actions",
      ],
      technologies: ["Next.js", "Node.js", "MongoDB", "Express"],
    },
  ];
}

function getDefaultProfileData(): PortfolioProfile {
  return {
    name: "Alice Johnson",
    title: "Senior Frontend Engineer",
    bio: "I'm a frontend developer with 8+ years of experience building accessible, high-performance web apps using React and TypeScript. I love crafting beautiful UI and mentoring junior devs.",
    email: "alice.johnson@example.com",
    phone: "+1 555-987-6543",
    location: "San Francisco, CA",
    website: "https://alicejohnson.dev",
    profilePhoto:
      "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a",
    socialMedia: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/alicejohnson",
      },
      {
        platform: "GitHub",
        url: "https://github.com/alicejohnson",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/alicecodes",
      },
    ],
  };
}

function getDefaultProjectsData(): Project[] {
  return [
    {
      _id: Date.now().toString(),
      title: "DevConnect",
      description:
        "A social platform for developers to share projects, blog posts, and collaborate in real time.",
      thumbnail: "https://images.unsplash.com/photo-1559311648-d46f5d8593d6",
      demoUrl: "https://devconnect.app",
      githubUrl: "https://github.com/user/devconnect",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
      isFeatured: true,
    },
    {
      _id: (Date.now() + 1).toString(),
      title: "TaskFlow",
      description:
        "A kanban-style task management tool for teams, built with real-time collaboration features.",
      thumbnail: "https://images.unsplash.com/photo-1559311648-d46f5d8593d6",
      demoUrl: "https://taskflow.io",
      githubUrl: "https://github.com/user/taskflow",
      technologies: ["React", "Zustand", "Firebase", "Framer Motion"],
      isFeatured: false,
    },
    {
      _id: (Date.now() + 2).toString(),
      title: "CodeSnip",
      description:
        "A snippet manager for developers with GitHub auth, Markdown support, and syntax highlighting.",
      thumbnail: "https://images.unsplash.com/photo-1559311648-d46f5d8593d6",
      demoUrl: "https://codesnip.dev",
      githubUrl: "https://github.com/user/codesnip",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Shadcn/UI"],
      isFeatured: true,
    },
  ];
}
