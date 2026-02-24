"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Portfolio, Skill } from "@/lib/services/portfolios-service";
import { m } from "framer-motion";

interface PortfolioSkillsProps {
  portfolio: Portfolio;
}
type SkillCategory = {
  title: string;
  skills: string[];
  color: string;
};
export function PortfolioSkills({ portfolio }: PortfolioSkillsProps) {
  function mapSkillsToCategories(skills: Skill[]): SkillCategory[] {
    const categoryMap = {
      frontend: {
        title: "Frontend",
        color: "bg-blue-500/10 text-blue-700 border-blue-200 ",
      },
      backend: {
        title: "Backend",
        color: "bg-green-500/10 text-green-700 border-green-200 ",
      },
      devops: {
        title: "DevOps",
        color: "bg-yellow-500/10 text-yellow-700 border-yellow-200 ",
      },
      database: {
        title: "Database",
        color: "bg-pink-500/10 text-pink-700 border-pink-200 ",
      },
      tools: {
        title: "Tools & Technologies",
        color: "bg-purple-500/10 text-purple-700 border-purple-200 ",
      },
      other: {
        title: "Other",
        color: "bg-gray-500/10 text-gray-700 border-gray-200 ",
      },
    };

    return Object.entries(categoryMap).map(([key, meta]) => ({
      title: meta.title,
      color: meta.color,
      skills: skills.filter((s) => s.category === key).map((s) => s.name),
    }));
  }
  const skillCategories = mapSkillsToCategories(portfolio.skills);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 portfolio-text-primary dark:text-slate-200">
            Skills & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to
            life.
          </p>
        </m.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <m.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full portfolio-gradient text-white border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`hover:scale-105 transition-transform cursor-default text-black dark:text-white`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
