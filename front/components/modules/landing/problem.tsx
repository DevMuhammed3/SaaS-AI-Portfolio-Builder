"use client";

import { m } from "framer-motion";
import Container from "@/components/custom/container";
import { useReducedMotion } from "@/hooks/useAccessibility";

export default function Problem() {
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
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/20">
      <Container>
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={animation}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Why building a portfolio feels overwhelming
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Most developers delay their portfolio because it takes too much
            time and effort to get it right.
          </p>
        </m.div>

        <div className="mt-20 grid md:grid-cols-3 gap-10">
          <ProblemCard
            title="Writing strong descriptions is hard"
            description="Turning your projects into clear, professional case studies takes hours — and most people don’t know what recruiters want to read."
          />
          <ProblemCard
            title="Designing a clean layout takes time"
            description="Good design isn’t easy. Spacing, typography, and structure matter more than you think."
          />
          <ProblemCard
            title="Deploying and hosting is confusing"
            description="Domains, hosting, performance, SEO — it’s overwhelming if you just want something professional online quickly."
          />
        </div>
      </Container>
    </section>
  );
}

function ProblemCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group p-10 rounded-2xl border bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
