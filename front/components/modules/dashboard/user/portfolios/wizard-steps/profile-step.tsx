"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Plus, X, Sparkles, Loader2 } from "lucide-react";
import {
  PortfolioProfile,
  SocialMedia,
} from "@/lib/services/portfolios-service";
import { ProfileSchema } from "@/lib/validations/portfolio";
import { useAIPrompt } from "@/hooks/useAIPrompt";
import { showToast } from "@/lib/toast";

interface ProfileStepProps {
  data: PortfolioProfile | undefined;
  onUpdate: (profile: PortfolioProfile) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

/**
 * Profile Step Component
 *
 * Second step of the portfolio wizard where users add their personal
 * information including name, title, bio, and social media links.
 *
 * Features:
 * - Profile photo upload
 * - Personal information form
 * - Social media links management
 * - Bio text area
 * - Form validation
 */
export function ProfileStep({
  data,
  onUpdate,
  validationErrors,
  setValidationErrors,
}: ProfileStepProps) {
  const [profile, setProfile] = useState<PortfolioProfile>({
    name: data?.name || "",
    title: data?.title || "",
    bio: data?.bio || "",
    email: data?.email || "",
    phone: data?.phone || "",
    location: data?.location || "",
    website: data?.website || "",
    profilePhoto:
      data?.profilePhoto || "http://localhost:3000/user/portfolios/new",
    socialMedia: data?.socialMedia || [],
  });
  const { generateProfile, isGeneratingProfile } = useAIPrompt();

  function validateFieldOnBlur<K extends keyof typeof ProfileSchema.shape>(
    key: K,
    value: unknown
  ) {
    const fieldSchema = ProfileSchema.shape[key];
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
  function validateSocialMediaFieldOnBlur(
    field: "platform" | "url",
    value: unknown,
    index: number,
    allSocialMedia: SocialMedia[]
  ): boolean {
    const key = `socialMedia.${index}.${field}`;
    const socialArraySchema = ProfileSchema.shape.socialMedia.unwrap();
    const elementSchema = socialArraySchema.element;
    const fieldSchema = elementSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      setValidationErrors((prev) => ({
        ...prev,
        [key]: result.error.errors[0]?.message || `Invalid ${field}`,
      }));
      return false;
    }

    // Check duplicate URL only if field is url
    if (field === "url") {
      const duplicate = allSocialMedia.findIndex(
        (item, idx) => idx !== index && item.url === value
      );
      if (duplicate !== -1) {
        setValidationErrors((prev) => ({
          ...prev,
          [key]: "Duplicate URL is not allowed",
        }));
        return false;
      }
    }

    // Clear error if valid
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    return true;
  }

  // Update profile data
  const updateProfile = (updates: Partial<PortfolioProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    onUpdate(updatedProfile);
  };

  // Add social link
  const addSocialLink = () => {
    const newLinks = [...profile.socialMedia, { platform: "", url: "" }];
    updateProfile({ socialMedia: newLinks });
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    const newLinks = profile.socialMedia.filter(
      (_: unknown, i: number) => i !== index
    );
    updateProfile({ socialMedia: newLinks });
  };

  // Update social link
  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...profile.socialMedia];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateProfile({ socialMedia: newLinks });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      alert("Only PNG and JPEG images are allowed.");
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 2MB.");
      return;
    }

    // If all good, read file as base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateProfile({ profilePhoto: base64 }); // Update profile photo with base64 string
    };
    reader.readAsDataURL(file);
  };

  // Fill with AI using the hook
  const handleFillWithAI = async () => {
    const generatedProfile = await generateProfile({
      industry: "Technology", // You can make this dynamic
      role: "Developer",
    });
    if (!generatedProfile) {
      showToast.error("Failed to generate profile with AI");
      return;
    }
    setProfile(generatedProfile);
    onUpdate(generatedProfile);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
        <p className="text-muted-foreground">
          Add your personal information to create your professional profile
        </p>

        <Button
          variant="primary"
          size="sm"
          onClick={handleFillWithAI}
          className="gap-2 text-xl mt-2"
          disabled={isGeneratingProfile}
        >
          {isGeneratingProfile ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGeneratingProfile ? "Generating..." : "Fill with AI"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.profilePhoto} />
                <AvatarFallback className="text-lg">
                  {profile.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={handleFileClick}
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  onBlur={(e) => validateFieldOnBlur("name", e.target.value)}
                  className={
                    validationErrors.name ? "border-red-500 text-red-500" : ""
                  }
                  placeholder="John Doe"
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => updateProfile({ title: e.target.value })}
                placeholder="Full Stack Developer"
                onBlur={(e) => validateFieldOnBlur("title", e.target.value)}
                className={validationErrors.title ? "border-red-500" : ""}
              />
              {validationErrors.title && (
                <p className="text-sm text-red-500">{validationErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => updateProfile({ location: e.target.value })}
                onBlur={(e) => validateFieldOnBlur("location", e.target.value)}
                placeholder="New York, NY"
                className={validationErrors.location ? "border-red-500" : ""}
              />
              {validationErrors.location && (
                <p className="text-sm text-red-500">
                  {validationErrors.location}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
                onBlur={(e) => validateFieldOnBlur("email", e.target.value)}
                placeholder="john@example.com"
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => updateProfile({ phone: e.target.value })}
                onBlur={(e) => validateFieldOnBlur("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profile.website}
              onChange={(e) => updateProfile({ website: e.target.value })}
              onBlur={(e) => validateFieldOnBlur("website", e.target.value)}
              placeholder="https://johndoe.com"
              className={validationErrors.website ? "border-red-500" : ""}
            />
            {validationErrors.website && (
              <p className="text-sm text-red-500">{validationErrors.website}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Write a brief description about yourself, your experience, and what you're passionate about..."
              rows={4}
              onBlur={(e) => validateFieldOnBlur("bio", e.target.value)}
              className={validationErrors.bio ? "border-red-500" : ""}
            />
            {validationErrors.bio && (
              <p className="text-sm text-red-500">{validationErrors.bio}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {profile.bio.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Social Media Links</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              className="gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.socialMedia.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No social links added yet. Click Add Link to get started.
            </p>
          ) : (
            profile.socialMedia.map((link: SocialMedia, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Platform (e.g., LinkedIn)"
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, "platform", e.target.value)
                  }
                  onBlur={(e) =>
                    validateSocialMediaFieldOnBlur(
                      "platform",
                      e.target.value,
                      index,
                      profile.socialMedia
                    )
                  }
                  className={`flex-1 ${
                    validationErrors[`socialMedia.${index}.platform`]
                      ? "border-red-500"
                      : ""
                  }`}
                />

                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    updateSocialLink(index, "url", e.target.value)
                  }
                  onBlur={(e) =>
                    validateSocialMediaFieldOnBlur(
                      "url",
                      e.target.value,
                      index,
                      profile.socialMedia
                    )
                  }
                  className={`flex-2 ${
                    validationErrors[`socialMedia.${index}.url`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
