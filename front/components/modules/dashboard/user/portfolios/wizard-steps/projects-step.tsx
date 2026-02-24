"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  FolderOpen,
  ExternalLink,
  Github,
  Upload,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Project } from "@/lib/services/portfolios-service";
import Image from "next/image";
import { ProjectSchema, TechnologySchema } from "@/lib/validations/portfolio";
import { useAIPrompt } from "@/hooks/useAIPrompt";

interface ProjectsStepProps {
  data: Project[];
  onUpdate: (projects: Project[]) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

/**
 * Projects Step Component
 *
 * Fifth step of the portfolio wizard where users add their projects.
 * Supports multiple projects with detailed information and links.
 *
 * Features:
 * - Multiple project entries
 * - Project thumbnails
 * - Technology tags
 * - Demo and GitHub links
 * - Rich project descriptions
 */
export function ProjectsStep({
  data,
  onUpdate,
  validationErrors,
  setValidationErrors,
}: ProjectsStepProps) {
  const [projects, setProjects] = useState<Project[]>(data);
  const { generateProjects, isGeneratingProjects } = useAIPrompt();

  // Update projects
  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    onUpdate(newProjects);
  };

  // Add new project
  const addProject = () => {
    const newProject = {
      _id: Date.now().toString(),
      title: "",
      description: "",
      thumbnail: "https://images.unsplash.com/photo-1559311648-d46f5d8593d6",
      demoUrl: "",
      githubUrl: "",
      technologies: [],
      isFeatured: false,
    };
    updateProjects([...projects, newProject]);
  };

  // Remove project
  const removeProject = (_id: string) => {
    updateProjects(projects.filter((project: Project) => project._id !== _id));
  };

  // Update project field
  const updateProject = (
    _id: string,
    field: string,
    value: string | boolean
  ) => {
    updateProjects(
      projects.map((project: Project) =>
        project._id === _id ? { ...project, [field]: value } : project
      )
    );
  };

  // Add technology tag
  const addTechnology = (projectId: string, tech: string) => {
    if (!tech.trim()) return;

    updateProjects(
      projects.map((project: Project) =>
        project._id === projectId
          ? { ...project, technologies: [...project.technologies, tech.trim()] }
          : project
      )
    );
  };

  // Remove technology tag
  const removeTechnology = (projectId: string, techIndex: number) => {
    updateProjects(
      projects.map((project: Project) =>
        project._id === projectId
          ? {
              ...project,
              technologies: project.technologies.filter(
                (_: string, i: number) => i !== techIndex
              ),
            }
          : project
      )
    );
  };

  const handleProjectImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    projectId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: max size 2MB (adjust as needed)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    // Validation: allow only certain image types (jpeg, png, gif)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a JPG, PNG, or GIF image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProject(projectId, "thumbnail", base64); // update the project thumbnail
    };
    reader.readAsDataURL(file);
  };

  function validateProjectFieldOnBlur(
    field: keyof typeof ProjectSchema.shape,
    value: unknown,
    index: number
  ): boolean {
    const key = `projects.${index}.${field}`;
    const fieldSchema = ProjectSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      setValidationErrors((prev) => ({
        ...prev,
        [key]: result.error.errors[0]?.message || `Invalid ${field}`,
      }));
      return false;
    }

    // Clear the error if validation passes
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    return true;
  }

  function validateProjectTechnologyItem(
    value: unknown,
    projectIndex: number
  ): boolean {
    const key = `projects.${projectIndex}.technologies`;
    const result = TechnologySchema.safeParse(value);

    if (!result.success) {
      setValidationErrors((prev) => ({
        ...prev,
        [key]: result.error.errors[0]?.message || "Invalid technology",
      }));
      return false;
    }

    // Clear the error if validation passes
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    return true;
  }

  const handleFillProjectsWithAI = async () => {
    const generatedProjects = await generateProjects({
      userProfile: {
        name: "User", // You can pass actual user data if available
        title: "Developer",
        bio: "Professional developer",
      },
      technologies: ["React", "TypeScript", "Next.js", "Node.js"], // You can make this dynamic
    });

    setProjects(generatedProjects);
    onUpdate(generatedProjects);
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Projects</h2>
        <p className="text-muted-foreground">
          Showcase your best projects and demonstrate your skills
        </p>
      </div>

      {/* Add Project Button */}
      <div className="flex flex-col gap-2 items-center justify-center">
        <Button onClick={addProject} className="gap-2" variant={"secondary"}>
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleFillProjectsWithAI}
          className="gap-2 text-xl mt-2"
          disabled={isGeneratingProjects}
        >
          {isGeneratingProjects ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGeneratingProjects ? "Generating..." : "Fill with AI"}
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects added</h3>
              <p className="text-muted-foreground mb-4">
                Add your projects to showcase your work and technical skills
              </p>
              <Button onClick={addProject} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project: Project, index: number) => (
            <Card key={project._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Project #{index + 1}
                    {project.isFeatured && (
                      <Badge className="ml-2">Featured</Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(project._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Thumbnail */}
                <div className="space-y-2">
                  <Label>Project Thumbnail</Label>
                  <div className="flex items-center gap-4">
                    {project.thumbnail ? (
                      <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden">
                        <Image
                          width={128}
                          height={80}
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        id={`project-thumbnail-${project._id}`}
                        onChange={(e) =>
                          handleProjectImageUpload(e, project._id)
                        }
                        className="hidden"
                      />
                      <label htmlFor={`project-thumbnail-${project._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent cursor-pointer"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    value={project.title}
                    onChange={(e) =>
                      updateProject(project._id, "title", e.target.value)
                    }
                    placeholder="My Awesome Project"
                    onBlur={(e) =>
                      validateProjectFieldOnBlur("title", e.target.value, index)
                    }
                    className={`flex-1 ${
                      validationErrors[`projects.${index}.title`]
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors[`projects.${index}.title`] && (
                    <p className="text-sm text-red-500">
                      {validationErrors[`projects.${index}.title`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject(project._id, "description", e.target.value)
                    }
                    placeholder="Describe your project, what it does, and what technologies you used..."
                    rows={3}
                    onBlur={(e) =>
                      validateProjectFieldOnBlur(
                        "description",
                        e.target.value,
                        index
                      )
                    }
                    className={`flex-1 ${
                      validationErrors[`projects.${index}.description`]
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors[`projects.${index}.description`] && (
                    <p className="text-sm text-red-500">
                      {validationErrors[`projects.${index}.description`]}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Demo URL
                    </Label>
                    <Input
                      value={project.demoUrl}
                      onChange={(e) =>
                        updateProject(project._id, "demoUrl", e.target.value)
                      }
                      placeholder="https://myproject.com"
                      onBlur={(e) =>
                        validateProjectFieldOnBlur(
                          "demoUrl",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`projects.${index}.demoUrl`]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {validationErrors[`projects.${index}.demoUrl`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`projects.${index}.demoUrl`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub URL
                    </Label>
                    <Input
                      value={project.githubUrl}
                      onChange={(e) =>
                        updateProject(project._id, "githubUrl", e.target.value)
                      }
                      placeholder="https://github.com/username/project"
                      onBlur={(e) =>
                        validateProjectFieldOnBlur(
                          "githubUrl",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`projects.${index}.githubUrl`]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {validationErrors[`projects.${index}.githubUrl`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`projects.${index}.githubUrl`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <Label>Technologies Used</Label>

                  {/* Technology Input */}
                  <div className="flex gap-2 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <Input
                        placeholder="Add technology (e.g., React, Node.js)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.target as HTMLInputElement;
                            addTechnology(project._id, input.value);
                            input.value = "";
                          }
                        }}
                        onBlur={(e) =>
                          validateProjectTechnologyItem(e.target.value, index)
                        }
                      />
                      {validationErrors[`projects.${index}.technologies`] && (
                        <p className="text-sm text-red-500">
                          {validationErrors[`projects.${index}.technologies`]}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = (
                          e.target as HTMLElement
                        ).parentElement?.querySelector("input");
                        if (input) {
                          addTechnology(project._id, input.value);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Technology Tags */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(
                        (tech: string, techIndex: number) => {
                          return (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="gap-1"
                            >
                              {tech}
                              <button
                                onClick={() =>
                                  removeTechnology(project._id, techIndex)
                                }
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* Featured Project Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`featured-${project._id}`}
                    checked={project.isFeatured}
                    onChange={(e) =>
                      updateProject(project._id, "isFeatured", e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor={`featured-${project._id}`}>
                    Mark as featured project
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
