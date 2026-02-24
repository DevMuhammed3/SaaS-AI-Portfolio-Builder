"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Globe, MapPin, ChevronDown } from "lucide-react";
import { m } from "framer-motion";
import { Portfolio } from "@/lib/services/portfolios-service";

interface PortfolioHeaderProps {
  portfolio: Portfolio;
}

export function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 pt-16"
    >
      <div className="container mx-auto px-4 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Avatar className="w-32 h-32 mx-auto mb-6">
              <AvatarImage
                src={portfolio.profile.profilePhoto}
                alt={portfolio.name}
              />
              <AvatarFallback className="text-2xl">
                {portfolio.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-4"
          >
            {portfolio.profile.title}
          </m.h2>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-6"
          >
            {portfolio.profile.name}
          </m.h2>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${portfolio.profile.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                {portfolio.profile.email}
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${portfolio.profile.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                {portfolio.profile.phone}
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={portfolio.profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 mr-2" />
                Website
              </a>
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              {portfolio.profile.location}
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {portfolio.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill.name}
              </Badge>
            ))}
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              onClick={scrollToNext}
              size="lg"
              className="rounded-full portfolio-bg-primary"
            >
              Explore My Work
              <ChevronDown className="h-4 w-4 ml-2 animate-bounce" />
            </Button>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
