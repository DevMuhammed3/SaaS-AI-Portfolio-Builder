"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/lib/services/portfolios-service";
import {
  AchievementSchema,
  ExperienceSchema,
} from "@/lib/validations/portfolio";
import { useAIPrompt } from "@/hooks/useAIPrompt";

interface ExperienceStepProps {
  data: Experience[];
  onUpdate: (experience: Experience[]) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

/**
 * Experience Step Component
 *
 * Fourth step of the portfolio wizard where users add their work experience.
 * Supports multiple positions with detailed information.
 *
 * Features:
 * - Multiple work experiences
 * - Current position indicator
 * - Key achievements tracking
 * - Date range validation
 * - Rich text descriptions
 */
export function ExperienceStep({
  data,
  onUpdate,
  validationErrors,
  setValidationErrors,
}: ExperienceStepProps) {
  const [experiences, setExperiences] = useState(data || []);
  const { generateExperience, isGeneratingExperience } = useAIPrompt();

  // Update experiences
  const updateExperiences = (newExperiences: Experience[]) => {
    setExperiences(newExperiences);
    onUpdate(newExperiences);
  };

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      _id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      isCurrent: false,
      description: "",
      achievements: [""],
      technologies: [],
    };
    updateExperiences([...experiences, newExperience]);
  };

  // Remove experience
  const removeExperience = (_id: string) => {
    updateExperiences(experiences.filter((exp: Experience) => exp._id !== _id));
  };

  // Update experience field
  const updateExperience = (
    _id: string,
    field: string,
    value: null | string | Date | boolean
  ) => {
    setExperiences((prev) => {
      const updated = prev.map((exp) =>
        exp._id === _id ? { ...exp, [field]: value } : exp
      );
      onUpdate(updated); // still call parent update
      return updated;
    });
  };

  // Add achievement
  const addAchievement = (experienceId: string) => {
    updateExperiences(
      experiences.map((exp: Experience) =>
        exp._id === experienceId
          ? { ...exp, achievements: [...exp.achievements, ""] }
          : exp
      )
    );
  };

  // Remove achievement
  const removeAchievement = (experienceId: string, index: number) => {
    updateExperiences(
      experiences.map((exp: Experience) =>
        exp._id === experienceId
          ? {
              ...exp,
              achievements: exp.achievements.filter(
                (_: string, i: number) => i !== index
              ),
            }
          : exp
      )
    );
  };

  // Update achievement
  const updateAchievement = (
    experienceId: string,
    index: number,
    value: string
  ) => {
    updateExperiences(
      experiences.map((exp: Experience) =>
        exp._id === experienceId
          ? {
              ...exp,
              achievements: exp.achievements.map((ach: string, i: number) =>
                i === index ? value : ach
              ),
            }
          : exp
      )
    );
  };
  const formatDateForMonthInput = (date: string | Date | undefined | null) => {
    if (!date) return "";
    // If it's a Date, convert to ISO string
    if (date instanceof Date) return date.toISOString().slice(0, 7);
    // If it's a string, slice it (assuming it's ISO string)
    if (typeof date === "string") return date.slice(0, 7);
    return "";
  };

  function validateExperienceFieldOnBlur(
    field: keyof typeof ExperienceSchema.shape,
    value: unknown,
    index: number
  ): boolean {
    const key = `experiences.${index}.${field}`;
    const fieldSchema = ExperienceSchema.shape[field];
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

  function validateAchievementFieldOnBlur(
    value: unknown,
    index: number, // experience index
    achIndex: number
  ): boolean {
    const key = `experiences.${index}.achievements.${achIndex}`;
    const result = AchievementSchema.safeParse(value);

    if (!result.success) {
      setValidationErrors((prev) => ({
        ...prev,
        [key]: result.error.errors[0]?.message || "Invalid achievement",
      }));
      return false;
    }

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    return true;
  }
  // Handler to generate and populate mock experience
  // Handler to generate and populate experience using AI
  const handleFillExperienceWithAI = async () => {
    const generatedExperiences = await generateExperience({
      userProfile: {
        name: "User", // You can pass actual user data if available
        title: "Developer",
        bio: "Professional developer",
      },
    });

    setExperiences(generatedExperiences);
    onUpdate(generatedExperiences);
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
        <p className="text-muted-foreground">
          Add your professional work experience and key achievements
        </p>
      </div>

      {/* Add Experience Button */}
      <div className="flex flex-col gap-2  items-center justify-center">
        <Button onClick={addExperience} className="gap-2" variant={"secondary"}>
          <Plus className="h-4 w-4" />
          Add Work Experience
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleFillExperienceWithAI}
          className="gap-2 text-xl mt-2"
          disabled={isGeneratingExperience}
        >
          {isGeneratingExperience ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGeneratingExperience ? "Generating..." : "Fill with AI"}
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No work experience added
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your professional experience to showcase your career journey
              </p>
              <Button onClick={addExperience} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          experiences.map((experience: Experience, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experience #{index + 1}
                    {experience.isCurrent && (
                      <Badge className="ml-2">Current Position</Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(experience._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      value={experience.title}
                      onChange={(e) =>
                        updateExperience(
                          experience._id,
                          "title",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        validateExperienceFieldOnBlur(
                          "title",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`experiences.${index}.title`]
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Senior Software Engineer"
                    />
                    {validationErrors[`experiences.${index}.title`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`experiences.${index}.title`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) =>
                        updateExperience(
                          experience._id,
                          "company",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        validateExperienceFieldOnBlur(
                          "company",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`experiences.${index}.company`]
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Tech Company Inc."
                    />
                    {validationErrors[`experiences.${index}.company`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`experiences.${index}.company`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={experience.location}
                    onChange={(e) =>
                      updateExperience(
                        experience._id,
                        "location",
                        e.target.value
                      )
                    }
                    className={`flex-1 ${
                      validationErrors[`experiences.${index}.location`]
                        ? "border-red-500"
                        : ""
                    }`}
                    onBlur={(e) =>
                      validateExperienceFieldOnBlur(
                        "location",
                        e.target.value,
                        index
                      )
                    }
                    placeholder="New York, NY"
                  />
                  {validationErrors[`experiences.${index}.location`] && (
                    <p className="text-sm text-red-500">
                      {validationErrors[`experiences.${index}.location`]}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      id={`startDate-${experience._id}`}
                      type="month"
                      value={formatDateForMonthInput(experience.startDate)}
                      onChange={(e) => {
                        // Convert "YYYY-MM" to a Date string like "YYYY-MM-01T00:00:00.000Z"
                        const newDate = new Date(
                          e.target.value + "-01T00:00:00.000Z"
                        );
                        updateExperience(experience._id, "startDate", newDate);
                      }}
                      onBlur={(e) =>
                        validateExperienceFieldOnBlur(
                          "startDate",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`experiences.${index}.startDate`]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {validationErrors[`experiences.${index}.startDate`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`experiences.${index}.startDate`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      id={`endDate-${experience._id}`}
                      type="month"
                      value={formatDateForMonthInput(experience.endDate)}
                      onChange={(e) => {
                        if (experience.isCurrent) {
                          updateExperience(experience._id, "endDate", null); // ✅ set null explicitly
                        } else {
                          const newDate = new Date(
                            e.target.value + "-01T00:00:00.000Z"
                          );
                          updateExperience(experience._id, "endDate", newDate);
                        }
                      }}
                      onBlur={(e) =>
                        validateExperienceFieldOnBlur(
                          "endDate",
                          e.target.value,
                          index
                        )
                      }
                      className={`flex-1 ${
                        validationErrors[`experiences.${index}.endDate`]
                          ? "border-red-500"
                          : ""
                      }`}
                      disabled={experience.isCurrent}
                      placeholder={experience.isCurrent ? "Present" : ""}
                    />
                    {validationErrors[`experiences.${index}.endDate`] && (
                      <p className="text-sm text-red-500">
                        {validationErrors[`experiences.${index}.endDate`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Current Position Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`isCurrent-${experience._id}`}
                    checked={!!experience.isCurrent}
                    onCheckedChange={(checked) => {
                      updateExperience(experience._id, "isCurrent", checked);
                      if (checked) {
                        updateExperience(experience._id, "endDate", null);
                      }
                    }}
                  />
                  <Label
                    htmlFor={`isCurrent-${experience._id}`}
                    className="cursor-pointer"
                  >
                    This is my current position
                  </Label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) =>
                      updateExperience(
                        experience._id,
                        "description",
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      validateExperienceFieldOnBlur(
                        "description",
                        e.target.value,
                        index
                      )
                    }
                    className={`flex-1 ${
                      validationErrors[`experiences.${index}.description`]
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Describe your role, responsibilities, and what you accomplished in this position..."
                    rows={3}
                  />
                  {validationErrors[`experiences.${index}.description`] && (
                    <p className="text-sm text-red-500">
                      {validationErrors[`experiences.${index}.description`]}
                    </p>
                  )}
                </div>

                {/* Key Achievements */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAchievement(experience._id)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Achievement
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {experience.achievements.map(
                      (achievement: string, achIndex: number) => {
                        const key = `experiences.${index}.achievements.${achIndex}`;
                        return (
                          <div key={achIndex} className="flex gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">
                              <Input
                                value={achievement}
                                onChange={(e) =>
                                  updateAchievement(
                                    experience._id,
                                    achIndex,
                                    e.target.value
                                  )
                                }
                                onBlur={(e) =>
                                  validateAchievementFieldOnBlur(
                                    e.target.value,
                                    index,
                                    achIndex
                                  )
                                }
                                placeholder="Describe a key achievement or accomplishment..."
                                className={`flex-1 ${
                                  validationErrors[key] ? "border-red-500" : ""
                                }`}
                              />
                              {validationErrors[key] && (
                                <p className="text-sm text-red-500">
                                  {validationErrors[key]}
                                </p>
                              )}
                            </div>
                            {experience.achievements.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeAchievement(experience._id, achIndex)
                                }
                                className="px-3"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
