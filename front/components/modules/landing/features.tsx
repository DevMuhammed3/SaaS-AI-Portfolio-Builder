"use client";

import { m } from "framer-motion";
import Container from "@/components/custom/container";
import { useReducedMotion } from "@/hooks/useAccessibility";
import { Sparkles, LayoutDashboard, Rocket, BarChart3 } from "lucide-react";

export default function Features() {
  const prefersReducedMotion = useReducedMotion();

  const animation = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.6 },
    },
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-muted/20 to-background">
      <Container>
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={animation}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to launch fast
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Build, optimize, and publish your portfolio in minutes.
          </p>
        </m.div>

        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI-powered content generation"
            description="Turn rough project notes into professional, recruiter-ready descriptions instantly."
          />
          <FeatureCard
            icon={<LayoutDashboard className="w-6 h-6" />}
            title="Structured experience & skills"
            description="Organize your background in a clean, easy-to-read format."
          />
          <FeatureCard
            icon={<Rocket className="w-6 h-6" />}
            title="One-click publishing"
            description="Go live instantly without worrying about hosting or deployment."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Built-in portfolio analytics"
            description="Track visits and engagement to understand how your portfolio performs."
          />
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-10 rounded-2xl border bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-pink-500/80 group-hover:text-white transition-colors">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
