"use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { m } from "framer-motion";
import { Portfolio } from "@/lib/services/portfolios-service";

interface PortfolioAboutProps {
  portfolio: Portfolio;
}

export function PortfolioAbout({ portfolio }: PortfolioAboutProps) {
  return (
    <section id="about" className="py-20 portfolio-gradient text-white">
      <div className="container mx-auto px-4">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            About Me
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white">
            Get to know more about my background, experience, and what drives my
            passion for design and development.
          </p>
        </m.div>

        <div className="grid md:grid-cols-1 gap-12 items-center">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-center text-white">
                {portfolio.profile.bio.substring(0, 1000)}
              </p>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
