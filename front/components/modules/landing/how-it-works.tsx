"use client";

import Container from "@/components/custom/container";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/useAccessibility";

export default function HowItWorks() {
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
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <Container>
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={animation}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Three simple steps. From idea to live portfolio.
          </p>
        </m.div>

        {/* Line Connector */}
        <div className="relative mt-20">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-border -z-10" />

          <div className="grid md:grid-cols-3 gap-12">
            <Step
              number="01"
              title="Add your information"
              description="Fill in your projects, experience, and skills using a structured, guided interface."
            />
            <Step
              number="02"
              title="Let AI enhance it"
              description="Instantly transform your rough inputs into professional, recruiter-ready content."
            />
            <Step
              number="03"
              title="Publish instantly"
              description="Go live with one click. No hosting setup. No deployment headaches."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-10 rounded-2xl border bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 text-center">
      <div className="text-6xl md:text-7xl font-extrabold text-primary/20 absolute -top-6 left-1/2 -translate-x-1/2 select-none">
        {number}
      </div>

      <div className="relative">
        <h3 className="text-xl font-semibold mt-8 mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
