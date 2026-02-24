"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, ArrowLeft, Loader2, Send } from "lucide-react";
import { LocaleLink } from "@/components/custom/locale-link";
import { ProfileStep } from "./wizard-steps/profile-step";
import { SkillsStep } from "./wizard-steps/skills-step";
import { ExperienceStep } from "./wizard-steps/experience-step";
import { ProjectsStep } from "./wizard-steps/projects-step";
import { usePortfolios } from "@/hooks/usePortfolios";
import { showToast } from "@/lib/toast";
import {
  Portfolio,
  UpdatePortfolioRequest,
} from "@/lib/services/portfolios-service";
import Container from "@/components/custom/container";
import Heading from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { devLog } from "@/lib/utils";

interface PortfolioEditorProps {
  portfolioId: string;
}

/**
 * Portfolio Editor Component
 *
 * Provides a tabbed interface for editing all sections of an existing portfolio.
 * Loads portfolio data and allows users to update individual sections.
 *
 * Features:
 * - Tabbed navigation for different sections
 * - Auto-save functionality
 * - Preview capability
 * - Form validation
 * - Loading states
 */
export function PortfolioEditor({ portfolioId }: PortfolioEditorProps) {
  const {
    currentPortfolio,
    loading,
    error,
    fetchPortfolioById,
    updatePortfolio,
    publishPortfolio,
  } = usePortfolios();

  const [portfolioData, setPortfolioData] = useState<
    Partial<UpdatePortfolioRequest>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  // Load portfolio data on mount
  useEffect(() => {
    if (portfolioId) {
      fetchPortfolioById(portfolioId);
    }
  }, [portfolioId, fetchPortfolioById]);

  // Update local state when portfolio data is loaded
  useEffect(() => {
    if (
      currentPortfolio &&
      currentPortfolio.name &&
      currentPortfolio.profile &&
      currentPortfolio.templateId._id
    ) {
      setPortfolioData({
        id: currentPortfolio._id,
        name: currentPortfolio.name,
        slug: currentPortfolio.slug,
        templateId: currentPortfolio.templateId._id,
        profile: currentPortfolio.profile,
        skills: currentPortfolio.skills ?? [],
        certifications: currentPortfolio.certifications ?? [],
        experiences: currentPortfolio.experiences ?? [],
        projects: currentPortfolio.projects ?? [],
        settings: currentPortfolio.settings ?? {},
        status: currentPortfolio.status,
      });
    }
  }, [currentPortfolio]);

  // Update portfolio data and mark as changed
  const updatePortfolioData = (stepData: Partial<Portfolio>) => {
    setPortfolioData((prev) => ({
      ...prev,
      ...stepData,
      templateId:
        typeof stepData.templateId === "object"
          ? stepData.templateId?._id
          : stepData.templateId,
    }));
    setHasUnsavedChanges(true);
  };

  // Save portfolio changes
  const handleSave = async () => {
    if (!currentPortfolio || !hasUnsavedChanges) return;

    // ❌ Prevent save if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      showToast.error("Please fix all form errors before saving.");
      return;
    }
    setIsSaving(true);
    try {
      const updatedPortfolio = await updatePortfolio(currentPortfolio._id, {
        ...portfolioData,
        templateId: currentPortfolio.templateId._id,
      });

      if (updatedPortfolio) {
        setHasUnsavedChanges(false);
        showToast.success("Portfolio saved successfully!");
      }
    } catch (error) {
      devLog.error("Error saving portfolio:", error);
      showToast.error("Failed to save portfolio. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save portfolio changes
  const handlePublish = async () => {
    if (!currentPortfolio) {
      showToast.info("Save your changes first!");
      return;
    }

    setIsSaving(true);
    try {
      //chenc premium access
      const publish = await publishPortfolio(currentPortfolio._id);

      if (publish) {
        showToast.success("Congrats, You are live! click on live button");
      } else {
        toast.success("Upgrade your plan to publish unlimited portfolio", {
          action: {
            label: "Upgrade Now",
            onClick: () => {
              window.open("/pricing", "_blank");
            },
          },
        });
      }
    } catch (error) {
      devLog.error("Error publishing portfolio:", error);
      showToast.error("Failed to publish portfolio. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (currentPortfolio) {
      window.open(
        currentPortfolio.status === "published"
          ? `/${currentPortfolio.slug}`
          : `/user/portfolios/preview/${currentPortfolio.slug}`,
        "_blank"
      );
    }
  };

  // Auto-save functionality (optional)
  // useEffect(() => {
  //   if (hasUnsavedChanges && !isSaving) {
  //     const autoSaveTimer = setTimeout(() => {
  //       handleSave();
  //     }, 3000000); // Auto-save after 30 seconds of inactivity

  //     return () => clearTimeout(autoSaveTimer);
  //   }
  // }, [hasUnsavedChanges, isSaving]);

  if (loading || !portfolioData.profile?.name) {
    return (
      <div className="flex items-center justify-center py-12 h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 h-screen flex flex-col items-center justify-center">
        <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <ArrowLeft className="h-12 w-12 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading portfolio</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => fetchPortfolioById(portfolioId)}>
            Try Again
          </Button>
          <LocaleLink href="/user/portfolios">
            <Button variant="outline">Back to Portfolios</Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  if (!currentPortfolio) {
    return (
      <div className="text-center py-12 h-screen">
        <h3 className="text-lg font-semibold mb-2">Portfolio not found</h3>
        <p className="text-muted-foreground mb-6">
          The portfolio you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <LocaleLink href="/user/portfolios">
          <Button>Back to Portfolios</Button>
        </LocaleLink>
      </div>
    );
  }

  return (
    <section className="py-10">
      <Container>
        <div className="flex flex-col gap-6">
          <Heading
            title={`Edit Portfolio - (${currentPortfolio.status})`}
            description={`Editing: ${currentPortfolio.name}`}
          />

          {/* Header */}
          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                {/* Left Side: Inputs */}
                <div className="flex flex-col gap-4 w-full flex-1">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Input
                      type="text"
                      value={portfolioData.name}
                      onChange={(e) =>
                        updatePortfolioData({ name: e.target.value })
                      }
                      placeholder="Portfolio Name"
                      className="w-full"
                    />
                    <Input
                      type="text"
                      value={portfolioData.slug}
                      onChange={(e) =>
                        updatePortfolioData({ slug: e.target.value })
                      }
                      placeholder="Slug (e.g., my-portfolio)"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Right Side: Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    variant="success"
                    disabled={currentPortfolio.status === "published"}
                    onClick={handlePublish}
                    className="w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {currentPortfolio.status === "published"
                      ? "Published"
                      : "Publish"}
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent w-full sm:w-auto"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4" />
                    {currentPortfolio.status === "published"
                      ? "Live"
                      : "Preview"}
                  </Button>

                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="gap-2 w-full sm:w-auto"
                    variant={"primary"}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Editor Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="profile" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="profile" className="mt-0">
                    <ProfileStep
                      data={portfolioData.profile}
                      onUpdate={(profile) => updatePortfolioData({ profile })}
                      validationErrors={validationErrors}
                      setValidationErrors={setValidationErrors}
                    />
                  </TabsContent>

                  <TabsContent value="skills" className="mt-0">
                    <SkillsStep
                      data={{
                        skills: portfolioData.skills,
                        certifications: portfolioData.certifications,
                      }}
                      onUpdate={(data) => updatePortfolioData(data)}
                    />
                  </TabsContent>

                  <TabsContent value="experience" className="mt-0">
                    <ExperienceStep
                      data={portfolioData.experiences ?? []}
                      onUpdate={(experiences) =>
                        updatePortfolioData({ experiences })
                      }
                      validationErrors={validationErrors}
                      setValidationErrors={setValidationErrors}
                    />
                  </TabsContent>

                  <TabsContent value="projects" className="mt-0">
                    <ProjectsStep
                      data={portfolioData.projects ?? []}
                      onUpdate={(projects) => updatePortfolioData({ projects })}
                      validationErrors={validationErrors}
                      setValidationErrors={setValidationErrors}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
