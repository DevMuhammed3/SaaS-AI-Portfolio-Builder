"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { TemplateSelectionStep } from "./wizard-steps/template-selection-step";
import { ProfileStep } from "./wizard-steps/profile-step";
import { SkillsStep } from "./wizard-steps/skills-step";
import { ExperienceStep } from "./wizard-steps/experience-step";
import { ProjectsStep } from "./wizard-steps/projects-step";
import { FinalizationStep } from "./wizard-steps/finalization-step";
import { usePortfolios } from "@/hooks/usePortfolios";
import { showToast } from "@/lib/toast";
import { CreatePortfolioRequest } from "@/lib/services/portfolios-service";
import Container from "@/components/custom/container";
import Heading from "@/components/custom/heading";
import { Plan } from "@/types";
import { devLog } from "@/lib/utils";

// Wizard steps configuration
const WIZARD_STEPS = [
  {
    id: "template",
    title: "Choose Template",
    description: "Select a template for your portfolio",
  },
  {
    id: "profile",
    title: "Profile Information",
    description: "Add your personal information",
  },
  {
    id: "skills",
    title: "Skills & Certifications",
    description: "Showcase your technical skills",
  },
  {
    id: "experience",
    title: "Work Experience",
    description: "Add your professional experience",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Showcase your best projects",
  },
  {
    id: "finalization",
    title: "Review & Publish",
    description: "Review and publish your portfolio",
  },
];

/**
 * Portfolio Creation Wizard Component
 *
 * A multi-step wizard that guides users through creating a new portfolio.
 * Each step collects specific information and validates input before proceeding.
 *
 * Features:
 * - Step-by-step navigation
 * - Progress indicator
 * - Form validation per step
 * - Data persistence across steps
 * - Back/Next navigation
 * - Final review and submission
 */
export function PortfolioWizard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { createPortfolio, loading } = usePortfolios();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [currentStep, setCurrentStep] = useState(0);
  const [portfolioData, setPortfolioData] = useState<
    Partial<CreatePortfolioRequest>
  >({
    name: "",
    templateId: "",
    profile: {
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      profilePhoto: "",
      socialMedia: [],
    },
    skills: [],
    certifications: [],
    experiences: [],
    projects: [],
    settings: {
      isPublic: true,
      allowComments: false,
      showContactInfo: true,
      customDomain: "",
    },
  });

  // Calculate progress percentage
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const stepId = WIZARD_STEPS[currentStep].id;

    switch (stepId) {
      case "template":
        if (!portfolioData.templateId) {
          showToast.error("Please select a template to continue");
          return false;
        }
        break;
      case "profile":
        if (!portfolioData.profile?.name) {
          showToast.error("Please enter your first and last name");
          return false;
        }
        if (!portfolioData.profile?.title) {
          showToast.error("Please enter your professional title");
          return false;
        }
        break;
      case "skills":
        if (!portfolioData.skills || portfolioData.skills.length === 0) {
          showToast.error("Please add at least one skill");
          return false;
        }
        break;
      case "experience":
        // Experience is optional, so no validation needed
        break;
      case "projects":
        // Projects are optional, so no validation needed
        break;
      // case "finalization":
      //   if (!portfolioData.name) {
      //     showToast.error("Please enter a portfolio name");
      //     return false;
      //   }
      //   break;
    }

    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update portfolio data
  const updatePortfolioData = (stepData: Partial<CreatePortfolioRequest>) => {
    setPortfolioData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  // Handle portfolio creation
  const handleCreatePortfolio = async () => {
    if (!validateCurrentStep()) return;

    // ❌ Prevent save if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      showToast.error(
        "Please fix all form errors before create your portfolio."
      );
      return;
    }

    try {
      // Generate portfolio name if not provided
      const portfolioName =
        portfolioData.name || `${portfolioData.profile?.name}  Portfolio`;

      const portfolioPayload: CreatePortfolioRequest = {
        name: portfolioName,
        templateId: portfolioData.templateId!,
        profile: portfolioData.profile!,
        skills: portfolioData.skills || [],
        certifications: portfolioData.certifications || [],
        experiences: portfolioData.experiences || [],
        projects: portfolioData.projects || [],
        settings: portfolioData.settings!,
      };

      const newPortfolio = await createPortfolio(portfolioPayload);

      if (newPortfolio) {
        showToast.success("Portfolio created successfully!");
        router.push(`/user/portfolios/${newPortfolio._id}`);
      }
    } catch (error) {
      devLog.error("Error creating portfolio:", error);
      showToast.error("Failed to create portfolio. Please try again.");
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const stepId = WIZARD_STEPS[currentStep].id;

    switch (stepId) {
      case "template":
        return (
          <TemplateSelectionStep
            plan={plan}
            data={portfolioData.templateId}
            onUpdate={(templateId) => updatePortfolioData({ templateId })}
          />
        );
      case "profile":
        return (
          <ProfileStep
            data={portfolioData.profile}
            onUpdate={(profile) => updatePortfolioData({ profile })}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case "skills":
        return (
          <SkillsStep
            data={{
              skills: portfolioData.skills,
              certifications: portfolioData.certifications,
            }}
            onUpdate={(data) => updatePortfolioData(data)}
          />
        );
      case "experience":
        return (
          <ExperienceStep
            data={portfolioData.experiences ?? []}
            onUpdate={(experiences) => updatePortfolioData({ experiences })}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case "projects":
        return (
          <ProjectsStep
            data={portfolioData.projects ?? []}
            onUpdate={(projects) => updatePortfolioData({ projects })}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case "finalization":
        return (
          <FinalizationStep
            data={portfolioData ?? []}
            onUpdate={updatePortfolioData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-6 py-8 relative ">
      <Container>
        <div className="flex flex-col gap-10">
          <Heading
            title="Create New Portfolio"
            description="Build your professional portfolio step by step"
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep === WIZARD_STEPS.length - 1 ? (
                <Button
                  onClick={handleCreatePortfolio}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Portfolio"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="gap-2"
                  variant={"primary"}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {/* Wizard Header */}
          <Card className="p-4 sm:p-6 md:p-8 w-full max-w-full">
            <CardHeader className="p-0">
              {/* Top Row: Title + Progress Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    Create New Portfolio
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Step {currentStep + 1} of {WIZARD_STEPS.length}:{" "}
                    {WIZARD_STEPS[currentStep].title}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              {/* Progress Bar */}
              <Progress value={progress} className="w-full" />

              {/* Steps Indicator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4 sm:gap-6">
                {WIZARD_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center w-full sm:w-auto ${
                      index < WIZARD_STEPS.length - 1 ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 min-w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="ml-2 hidden sm:block">
                      <p
                        className={`text-sm font-medium ${
                          index <= currentStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>

                    {index < WIZARD_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-4 ${
                          index < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Current Step Content */}
          <Card>
            <CardContent className="p-6">{renderCurrentStep()}</CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
