"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Star } from "lucide-react";
import { m } from "framer-motion";
import Image from "next/image";
import { Portfolio, Project } from "@/lib/services/portfolios-service";

interface PortfolioProjectsProps {
  portfolio: Portfolio;
}

export function PortfolioProjects({ portfolio }: PortfolioProjectsProps) {
  const featuredProjects = portfolio.projects.filter(
    (p: Project) => p.isFeatured
  );
  const otherProjects = portfolio.projects.filter(
    (p: Project) => !p.isFeatured
  );

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 portfolio-text-primary">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and the projects I&apos;m most proud
            of.
          </p>
        </m.div>

        <div className="space-y-12 mb-16  p-6 rounded-lg">
          {featuredProjects.map((project: Project, index: number) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden py-0 hover:portfolio-border-primary border-2 rounded-lg cursor-pointer">
                <div
                  className={`grid md:grid-cols-2 gap-0 ${
                    index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                  }`}
                >
                  <div
                    className={`relative h-64 md:h-auto ${
                      index % 2 === 1 ? "md:col-start-2" : ""
                    }`}
                  >
                    <Image
                      src={
                        project.thumbnail ??
                        "https://images.unsplash.com/photo-1559311648-d46f5d8593d6"
                      }
                      alt={project.title}
                      fill
                      className=""
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="portfolio-bg-primary text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <CardContent
                    className={`p-4 sm:p-6 md:p-8 flex flex-col justify-center ${
                      index % 2 === 1 ? "md:col-start-1" : ""
                    }`}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 portfolio-text-primary">
                      {project.title}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.technologies.map(
                        (tech: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="portfolio-bg-secondary text-white"
                          >
                            {tech}
                          </Badge>
                        )
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {project.demoUrl && (
                        <Button
                          asChild
                          className="hover:portfolio-border-primary border-2 portfolio-bg-primary w-full sm:w-auto"
                        >
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          asChild
                          className="portfolio-border-primary border-2 portfolio-text-secondary w-full sm:w-auto"
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </m.div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl font-bold mb-4 portfolio-text-primary">
                Other Projects
              </h3>
              <p className="text-muted-foreground">
                Additional projects and experiments I&apos;ve worked on.
              </p>
            </m.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project: Project, index: number) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full group hover:shadow-lg transition-shadow portfolio-border-primary border-2 rounded-lg py-0">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          project.thumbnail ??
                          "https://images.unsplash.com/photo-1559311648-d46f5d8593d6"
                        }
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold mb-2 portfolio-text-secondary">
                        {project.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies
                          .slice(0, 3)
                          .map((tech: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs portfolio-text-primary border portfolio-border-primary"
                            >
                              {tech}
                            </Badge>
                          ))}
                        {project.technologies.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs portfolio-text-primary border portfolio-border-primary"
                          >
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="portfolio-border-primary border-2 portfolio-text-primary"
                          >
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="portfolio-border-primary border-2 portfolio-text-secondary"
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
