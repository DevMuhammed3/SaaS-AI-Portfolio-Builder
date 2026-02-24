"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Certification,
  Proficiency,
  Skill,
  SkillCategory,
} from "@/lib/services/portfolios-service";
import { Sparkles } from "lucide-react";

// Predefined skills by category
const SKILL_CATEGORIES = {
  frontend: [
    "React",
    "Vue.js",
    "Angular",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Sass",
    "Next.js",
    "Nuxt.js",
    "Figma",
  ],
  backend: [
    "Node.js",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
  ],
  database: [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Oracle",
    "Microsoft SQL Server",
    "Cassandra",
    "DynamoDB",
    "Firebase",
  ],
  devops: [
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "Jenkins",
    "GitLab CI",
    "GitHub Actions",
    "Terraform",
    "Ansible",
  ],
  tools: [
    "TypeScript",
    "Git",
    "VS Code",
    "IntelliJ IDEA",
    "Adobe XD",
    "Postman",
    "Jira",
    "Slack",
    "Notion",
    "Linear",
  ],
};

// Certification providers
const CERTIFICATION_PROVIDERS = {
  aws: {
    name: "Amazon Web Services",
    certifications: [
      "AWS Certified Solutions Architect",
      "AWS Certified Developer",
      "AWS Certified SysOps Administrator",
      "AWS Certified DevOps Engineer",
      "AWS Certified Security Specialty",
    ],
  },
  microsoft: {
    name: "Microsoft",
    certifications: [
      "Microsoft Azure Fundamentals",
      "Microsoft Azure Developer Associate",
      "Microsoft Azure Solutions Architect",
      "Microsoft 365 Certified",
      "Power Platform Fundamentals",
    ],
  },
  google: {
    name: "Google Cloud",
    certifications: [
      "Google Cloud Associate Cloud Engineer",
      "Google Cloud Professional Cloud Architect",
      "Google Cloud Professional Data Engineer",
      "Google Cloud Professional DevOps Engineer",
    ],
  },
  other: {
    name: "Other Certifications",
    certifications: [
      "Certified Kubernetes Administrator (CKA)",
      "Certified Kubernetes Application Developer (CKAD)",
      "Docker Certified Associate",
      "Scrum Master Certification",
      "PMP Certification",
    ],
  },
};

const proficiencyMap: Record<number, Proficiency> = {
  1: Proficiency.Beginner,
  2: Proficiency.Intermediate,
  3: Proficiency.Advanced,
  4: Proficiency.Expert,
};

const proficiencyReverseMap: Record<Proficiency, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

interface SkillsStepProps {
  data: {
    skills?: Skill[];
    certifications?: Certification[];
  };
  onUpdate: (data: {
    skills: Skill[];
    certifications: Certification[];
  }) => void;
}

/**
 * Skills Step Component
 *
 * Third step of the portfolio wizard where users add their technical skills
 * and certifications. Organized by categories for better management.
 *
 * Features:
 * - Categorized skill selection
 * - Custom skill addition
 * - Skill proficiency levels
 * - Certification management
 * - Predefined skill suggestions
 */
export function SkillsStep({ data, onUpdate }: SkillsStepProps) {
  const [skillsData, setSkillsData] = useState({
    skills: data?.skills || [],
    certifications: data?.certifications || [],
  });

  // Update skills data
  const updateSkillsData = (
    updates: Partial<{ skills: Skill[]; certifications: Certification[] }>
  ) => {
    const updatedData = { ...skillsData, ...updates };
    setSkillsData(updatedData);
    onUpdate(updatedData);
  };

  const updateSkillProficiency = (
    skillName: string,
    newProficiency: Proficiency
  ) => {
    const updatedSkills = skillsData.skills.map((skill) =>
      skill.name === skillName
        ? { ...skill, proficiency: newProficiency }
        : skill
    );
    updateSkillsData({ skills: updatedSkills });
  };

  // Add skill
  const addSkill = (skillName: string, category: SkillCategory) => {
    const existingSkill = skillsData.skills.find(
      (s: Skill) => s.name === skillName
    );
    if (!existingSkill) {
      const newSkills = [
        ...skillsData.skills,
        { name: skillName, category, proficiency: "beginner" as Proficiency },
      ];
      updateSkillsData({ skills: newSkills });
    }
  };

  // Remove skill
  const removeSkill = (skillName: string) => {
    const newSkills = skillsData.skills.filter(
      (s: Skill) => s.name !== skillName
    );
    updateSkillsData({ skills: newSkills });
  };

  // Update skill level
  // const updateSkillLevel = (skillName: string, level: number) => {
  //   const newSkills = skillsData.skills.map((s: Skill) =>
  //     s.name === skillName ? { ...s, level } : s
  //   );
  //   updateSkillsData({ skills: newSkills });
  // };

  // Add certification
  const addCertification = (cert: Certification) => {
    const exists = skillsData.certifications.some(
      (c) => c.name === cert.name && c.provider === cert.provider
    );

    const newCertifications = exists
      ? skillsData.certifications.filter(
          (c) => !(c.name === cert.name && c.provider === cert.provider)
        )
      : [...skillsData.certifications, cert];

    updateSkillsData({ certifications: newCertifications });
  };

  // Remove certification
  const removeCertification = (index: number) => {
    const newCertifications = skillsData.certifications.filter(
      (_: Certification, i: number) => i !== index
    );
    updateSkillsData({ certifications: newCertifications });
  };
  const handleFillSkillsAndCertsWithAI = () => {
    // Randomly pick a few from each category
    const pickRandom = (arr: string[], count: number) => {
      return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    const getRandomProficiency = (): Proficiency => {
      const values = Object.values(proficiencyMap);
      const randIndex = Math.floor(Math.random() * values.length);
      return values[randIndex];
    };

    // Generate random skills
    const skills: Skill[] = [];

    Object.entries(SKILL_CATEGORIES).forEach(([category, skillList]) => {
      const picked = pickRandom(skillList, 2); // pick 2 per category
      picked.forEach((name) => {
        skills.push({
          name,
          category: category as SkillCategory,
          proficiency: getRandomProficiency(),
        });
      });
    });

    // Generate random certifications
    const certifications: Certification[] = [];

    Object.entries(CERTIFICATION_PROVIDERS).forEach(([, value]) => {
      const picked = pickRandom(value.certifications, 1);
      picked.forEach((cert) =>
        certifications.push({
          name: cert,
          provider: value.name,
        })
      );
    });

    const updated = { skills, certifications };
    setSkillsData(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Skills & Certifications</h2>
        <p className="text-muted-foreground">
          Showcase your technical skills and professional certifications
        </p>

        <Button
          variant="primary"
          size="sm"
          onClick={handleFillSkillsAndCertsWithAI}
          className="gap-2 text-xl mt-2"
        >
          <Sparkles className="h-4 w-4" />
          Fill Skills & Certs with AI
        </Button>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">Technical Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          {/* Selected Skills */}
          {skillsData.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillsData.skills.map((skill: Skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline">{skill.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Proficiency:
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <button
                                key={level}
                                onClick={() =>
                                  updateSkillProficiency(
                                    skill.name,
                                    proficiencyMap[level]
                                  )
                                }
                                className={`w-3 h-3 rounded-full border ${
                                  level <=
                                  proficiencyReverseMap[skill.proficiency]
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {proficiencyReverseMap[skill.proficiency]}/4
                          </span>
                          <span className="text-right flex-1">
                            {skill.proficiency}
                          </span>
                        </div>

                        <Progress
                          value={proficiencyReverseMap[skill.proficiency] * 25}
                          className="h-2"
                        />
                      </div>
                    </div>
                    <Button
                      className="hidden md:block"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(skill.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skill Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => {
              const typedCategory = category as SkillCategory;
              const typedSkills = skills as readonly string[];

              return (
                <Card key={typedCategory}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {typedCategory}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {typedSkills.map((skill) => {
                        const isSelected = skillsData.skills.some(
                          (s: Skill) => s.name === skill
                        );

                        return (
                          <Button
                            key={skill}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              isSelected
                                ? removeSkill(skill)
                                : addSkill(skill, typedCategory)
                            }
                            className="text-xs"
                          >
                            {isSelected && <X className="h-3 w-3 mr-1" />}
                            {skill}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          {/* Current Certifications */}
          {skillsData.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillsData.certifications.map(
                  (cert: Certification, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <Award className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.provider} •
                          {cert.issueDate &&
                            new Date(cert.issueDate).toDateString()}
                        </p>
                        {cert.credentialId && (
                          <p className="text-xs text-muted-foreground">
                            ID: {cert.credentialId}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* Add Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(CERTIFICATION_PROVIDERS).map(([key, provider]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {provider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 overflow-hidden break-words">
                    {provider.certifications.map((cert) => (
                      <Button
                        key={cert}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addCertification({
                            name: cert,
                            provider: provider.name,
                          })
                        }
                        className="max-w-full w-full sm:w-fit justify-start text-xs truncate"
                      >
                        <Plus className="h-3 w-3 mr-2 shrink-0" />
                        <span className="truncate">{cert}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
