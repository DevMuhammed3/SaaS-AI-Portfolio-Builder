"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, User, Code, Briefcase, FolderOpen } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  CreatePortfolioRequest,
  Experience,
  Project,
  Skill,
} from "@/lib/services/portfolios-service";
import { PortfolioSettingsSchema } from "@/lib/validations/portfolio";

interface FinalizationStepProps {
  data: Partial<CreatePortfolioRequest>;
  onUpdate: (data: Partial<CreatePortfolioRequest>) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

/**
 * Finalization Step Component
 *
 * Final step of the portfolio wizard where users review their portfolio
 * data and configure publication settings before creating the portfolio.
 *
 * Features:
 * - Complete portfolio preview
 * - Publication settings
 * - Portfolio name configuration
 * - Privacy settings
 * - Final validation
 */
export function FinalizationStep({
  data,
  onUpdate,
  setValidationErrors,
}: FinalizationStepProps) {
  const [portfolioSettings, setPortfolioSettings] = useState({
    name: `${data?.profile?.name || "My"} Portfolio`,
    isPublic: data?.settings?.isPublic ?? true,
    allowComments: data?.settings?.allowComments ?? false,
    showContactInfo: data?.settings?.showContactInfo ?? true,
    customDomain: data?.settings?.customDomain || "",
  });

  // Update portfolio settings
  const updateSettings = (
    updates: Partial<{
      name: string;
      isPublic: boolean;
      allowComments: boolean;
      showContactInfo: boolean;
      customDomain: string;
    }>
  ) => {
    const newSettings = { ...portfolioSettings, ...updates };
    setPortfolioSettings(newSettings);
    onUpdate({ ...data, ...newSettings });
  };

  // Get completion stats
  const getCompletionStats = () => {
    const stats = {
      template: data?.templateId ? 1 : 0,
      profile: data?.profile?.name ? 1 : 0,
      skills: data?.skills?.length ? 1 : 0,
      experiences: data?.experiences?.length ? 1 : 0,
      projects: data?.projects?.length ? 1 : 0,
    };

    const completed = Object.values(stats).reduce((sum, val) => sum + val, 0);
    const total = Object.keys(stats).length;

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const completionStats = getCompletionStats();

  function validateFieldOnBlur<
    K extends keyof typeof PortfolioSettingsSchema.shape
  >(key: K, value: unknown) {
    const fieldSchema = PortfolioSettingsSchema.shape[key];
    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      const message = result.error.errors[0].message;
      setValidationErrors((prev) => ({ ...prev, [key]: message }));
      // showToast.error(result.error.errors[0].message);
      return false;
    }
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    return true;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your portfolio information and configure publication settings
        </p>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Portfolio Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completionStats.completed}/{completionStats.total} sections
                completed
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionStats.percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div
                className={`flex items-center gap-2 ${
                  data?.templateId ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    data?.templateId
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />
                Template
              </div>
              <div
                className={`flex items-center gap-2 ${
                  data?.profile?.name
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <User
                  className={`h-4 w-4 ${
                    data?.profile?.name
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />
                Profile
              </div>
              <div
                className={`flex items-center gap-2 ${
                  data?.skills?.length
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <Code
                  className={`h-4 w-4 ${
                    data?.skills?.length
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />
                Skills
              </div>
              <div
                className={`flex items-center gap-2 ${
                  data?.experiences?.length
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <Briefcase
                  className={`h-4 w-4 ${
                    data?.experiences?.length
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />
                Experience
              </div>
              <div
                className={`flex items-center gap-2 ${
                  data?.projects?.length
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <FolderOpen
                  className={`h-4 w-4 ${
                    data?.projects?.length
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                />
                Projects
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolioName">Portfolio Name</Label>
            <Input
              id="portfolioName"
              value={portfolioSettings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              placeholder="My Professional Portfolio"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Portfolio</Label>
                <p className="text-sm text-muted-foreground">
                  Make your portfolio visible to everyone
                </p>
              </div>
              <Switch
                checked={portfolioSettings.isPublic}
                onCheckedChange={(checked) =>
                  updateSettings({ isPublic: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Contact Information</Label>
                <p className="text-sm text-muted-foreground">
                  Display your contact details on the portfolio
                </p>
              </div>
              <Switch
                checked={portfolioSettings.showContactInfo}
                onCheckedChange={(checked) =>
                  updateSettings({ showContactInfo: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Let visitors leave comments on your portfolio
                </p>
              </div>
              <Switch
                checked={portfolioSettings.allowComments}
                onCheckedChange={(checked) =>
                  updateSettings({ allowComments: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDomain">Custom Domain (Coming soon)</Label>
            <Input
              readOnly
              id="customDomain"
              value={portfolioSettings.customDomain}
              onChange={(e) => updateSettings({ customDomain: e.target.value })}
              onBlur={() =>
                validateFieldOnBlur(
                  "customDomain",
                  portfolioSettings.customDomain
                )
              }
              placeholder="myportfolio.com"
            />
            <p className="text-xs text-muted-foreground">
              Connect your own domain to your portfolio
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Section */}
          {data?.profile && (
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={data.profile.profilePhoto} />
                <AvatarFallback className="text-lg">
                  {data.profile.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{data.profile.name}</h3>
                <p className="text-muted-foreground">{data.profile.title}</p>
                <p className="text-sm text-muted-foreground">
                  {data.profile.location}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Skills Section */}
          {data?.skills?.length && (
            <div>
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 8).map((skill: Skill, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
                {data.skills.length > 8 && (
                  <Badge variant="outline">
                    +{data.skills.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Experience Section */}
          {data?.experiences?.length && (
            <div>
              <h4 className="font-semibold mb-3">Latest Experience</h4>
              <div className="space-y-2">
                {data.experiences
                  .slice(0, 2)
                  .map((exp: Experience, index: number) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <h6 className="font-medium">{exp.title}</h6>
                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                      </p>
                    </div>
                  ))}
                {data.experiences.length > 2 && (
                  <p className="text-sm text-muted-foreground">
                    +{data.experiences.length - 2} more positions
                  </p>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Projects Section */}
          {data?.projects && data.projects?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Featured Projects</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects
                  .slice(0, 2)
                  .map((project: Project, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h5 className="font-medium mb-1">{project.title}</h5>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies
                            .slice(0, 3)
                            .map((tech: string, techIndex: number) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {data.projects.length > 2 && (
                <p className="text-sm text-muted-foreground mt-2">
                  +{data.projects.length - 2} more projects
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
