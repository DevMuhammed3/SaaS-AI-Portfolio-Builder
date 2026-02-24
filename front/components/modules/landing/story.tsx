"use client";

import { m } from "framer-motion";
import { FormattedMessage } from "react-intl";
import Container from "@/components/custom/container";
import { memo } from "react";

interface StorySectionProps {
  videoUrl: string; // YouTube video embed link
}

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/**
 * Story Section Component
 * Displays reasons and an embedded video
 * Designed to support lazy loading (via React.lazy or next/dynamic)
 */
function Story({ videoUrl }: StorySectionProps) {
  return (
    <section className="px-4 py-20 bg-gray-100 dark:bg-gray-700">
      <Container className="max-w-4xl">
        {/* Story Heading */}
        <m.h4
          className="mb-8 text-center dark:text-white"
          variants={animationVariants}
          initial="hidden"
          animate="visible"
        >
          <FormattedMessage
            id="story.heading"
            defaultMessage="Why I built 10minPortfolio"
          />
        </m.h4>

        {/* Reasons */}
        <div className="space-y-6">
          {[
            {
              id: "story.reason1",
              defaultMessage:
                "I wanted to build a dynamic portfolio that I can update anytime without touching code.",
            },
            {
              id: "story.reason2",
              defaultMessage:
                "I wanted to apply to many jobs at once by creating multiple portfolios effortlessly.",
            },
            {
              id: "story.reason3",
              defaultMessage:
                "I wanted to create a clean, minimal one-page portfolio that showcases my skills effectively.",
            },
          ].map((reason, index) => (
            <m.div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
              variants={animationVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-lg text-gray-700 dark:text-gray-200">
                <FormattedMessage
                  id={reason.id}
                  defaultMessage={reason.defaultMessage}
                />
              </p>
            </m.div>
          ))}
        </div>

        {/* Video Section */}
        <m.div
          className="mt-12"
          variants={animationVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h6 className="text-center mb-6">
            <FormattedMessage
              id="story.watchFull"
              defaultMessage="Watch the Full Story"
            />
          </h6>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="10minPortfolio Story"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </m.div>
      </Container>
    </section>
  );
}
// Memoized default export for performance
export default memo(Story);
