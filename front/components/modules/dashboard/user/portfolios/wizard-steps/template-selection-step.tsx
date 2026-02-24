"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Eye, Lock } from "lucide-react";
import { Template } from "@/lib/services/templates-services";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateThumbnail from "@/components/custom/template-thumbnail";
import { Plan } from "@/types";
import { showToast } from "@/lib/toast";

// Mock templates data

interface TemplateSelectionStepProps {
  plan: Plan;
  data: string | undefined;
  onUpdate: (templateId: string) => void;
}

/**
 * Template Selection Step Component
 *
 * First step of the portfolio wizard where users select a template
 * for their portfolio. Shows available templates with preview options.
 *
 * Features:
 * - Template grid with thumbnails
 * - Premium template indicators
 * - Template categories
 * - Preview functionality
 * - Selection state management
 */
export function TemplateSelectionStep({
  plan,
  data,
  onUpdate,
}: TemplateSelectionStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(data || null);
  const { userTemplates, isLoading } = useTemplates();
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template._id);
    onUpdate(template._id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your style and profession
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading &&
          userTemplates &&
          userTemplates.map((template: Template) => (
            <Card
              key={template._id}
              className={`cursor-pointer transition-all hover:shadow-lg py-0 ${
                selectedTemplate === template._id
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => {
                if (plan === "free" && template.premium) {
                  showToast.info("This template is for premium users");
                  return;
                }
                handleTemplateSelect(template);
              }}
            >
              <CardContent className="p-0">
                {/* Template Thumbnail */}
                <div className="relative aspect-[6/3] bg-muted rounded-t-lg overflow-hidden">
                  <TemplateThumbnail template={template} />

                  {/* Premium Badge */}
                  {template.premium && (
                    <div className="absolute top-3 left-3">
                      <Badge className="gap-1 bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedTemplate === template._id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Preview Button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      {plan === "free" && template.premium ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}

                      {plan === "free" && template.premium ? "Lock" : "Select"}
                    </Button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <Badge variant="outline">{template.premium}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Selected Template:{" "}
            <span className="font-medium text-foreground">
              {userTemplates &&
                userTemplates.find((t: Template) => t._id === selectedTemplate)
                  ?.title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
