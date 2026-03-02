// "use client";
//
// import { PortfolioHeader } from "./sections/portfolio-header";
// import { PortfolioAbout } from "./sections/portfolio-about";
// import { PortfolioSkills } from "./sections/portfolio-skills";
// import { PortfolioExperience } from "./sections/portfolio-experience";
// import { PortfolioProjects } from "./sections/portfolio-projects";
// import { PortfolioContact } from "./sections/portfolio-contact";
// import { PortfolioNavigation } from "./portfolio-navigation";
// import { useEffect, useState } from "react";
// import { PremiumAccessModal } from "./sections/premium-access-modal";
// import { Portfolio } from "@/lib/services/portfolios-service";
// import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
//
// interface PortfolioPreviewProps {
//   portfolio: Portfolio;
//   userRole: string;
// }
//
// export function PortfolioPreview({
//   portfolio,
//   userRole,
// }: PortfolioPreviewProps) {
//   const [showPremiumModal, setShowPremiumModal] = useState(false);
//   const isPremium = userRole === "premium";
//   const { addView } = usePortfolioAnalytics(portfolio);
//
//   useEffect(() => {
//     addView();
//     if (!isPremium) {
//       const timer = setTimeout(() => {
//         setShowPremiumModal(true);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [isPremium, addView]);
//
//   useEffect(() => {
//     // Apply custom CSS variables for portfolio branding
//     const root = document.documentElement;
//     root.style.setProperty(
//       "--portfolio-primary",
//       portfolio.templateId.primaryColor || "#3b82f6"
//     );
//     root.style.setProperty(
//       "--portfolio-secondary",
//       portfolio.templateId.secondaryColor || "#64748b"
//     );
//     root.style.setProperty(
//       "--portfolio-font",
//       portfolio.templateId.font || "Inter"
//     );
//
//     // Cleanup on unmount
//     return () => {
//       root.style.removeProperty("--portfolio-primary");
//       root.style.removeProperty("--portfolio-secondary");
//       root.style.removeProperty("--portfolio-font");
//     };
//   }, [
//     portfolio.settings,
//     portfolio.templateId.font,
//     portfolio.templateId.primaryColor,
//     portfolio.templateId.secondaryColor,
//   ]);
//
//   return (
//     <div className="min-h-screen bg-background relative">
//       {/* Overlay if not premium */}
//       {!isPremium && (
//         <div className="absolute inset-0 z-50 backdrop-blur-sm bg-white/30 pointer-events-auto" />
//       )}
//
//       {/* Navigation */}
//       <PortfolioNavigation portfolio={portfolio} />
//
//       {/* Main Content */}
//       <main
//         className={`${
//           !isPremium ? "pointer-events-none select-none blur-sm" : ""
//         }`}
//       >
//         <section id="home" className="min-h-screen">
//           <PortfolioHeader portfolio={portfolio} />
//         </section>
//
//         <section id="about" className="py-20">
//           <PortfolioAbout portfolio={portfolio} />
//         </section>
//
//         <section id="skills" className="py-20 bg-muted/30">
//           <PortfolioSkills portfolio={portfolio} />
//         </section>
//
//         <section id="experience" className="py-20">
//           <PortfolioExperience portfolio={portfolio} />
//         </section>
//
//         <section id="projects" className="py-20 bg-muted/30">
//           <PortfolioProjects portfolio={portfolio} />
//         </section>
//
//         <section id="contact" className="py-20">
//           <PortfolioContact portfolio={portfolio} />
//         </section>
//       </main>
//
//       <PremiumAccessModal
//         userRole={userRole}
//         isOpen={showPremiumModal}
//         onOpenChange={setShowPremiumModal}
//       />
//
//       {/* Custom Styles */}
//       <style jsx global>{`
//         .animate-fade-in-up {
//           animation: fadeInUp 0.8s ease-out forwards;
//         }
//
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//
//         .portfolio-section {
//           opacity: 0;
//           transform: translateY(30px);
//           transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//
//         .portfolio-section.animate-fade-in-up {
//           opacity: 1;
//           transform: translateY(0);
//         }
//
//         .portfolio-gradient {
//           background: linear-gradient(
//             135deg,
//             var(--portfolio-primary),
//             var(--portfolio-secondary)
//           );
//         }
//
//         .portfolio-text-primary {
//           color: var(--portfolio-primary) dark:text-white;
//         }
//
//         .portfolio-text-secondary {
//           color: var(--portfolio-secondary) dark:text-white;
//         }
//
//         .portfolio-border-primary {
//           border-color: var(--portfolio-primary);
//         }
//
//         .portfolio-bg-primary {
//           background-color: var(--portfolio-primary);
//         }
//
//         .portfolio-bg-secondary {
//           background-color: var(--portfolio-secondary);
//         }
//       `}</style>
//     </div>
//   );
// }


import CreativeTemplate from "@/components/portfolio-templates/creative/CreativeTemplate";
import MinimalDevTemplate from "@/components/portfolio-templates/minimal-dev/MinimalDevTemplate";
// import CreativeTemplate from "@/components/portfolio-templates/creative/CreativeTemplate";
// import MinimalistTemplate from "@/components/portfolio-templates/minimalist/MinimalistTemplate";
// import ModernTemplate from "@/components/portfolio-templates/modern/ModernTemplate";

import { Portfolio } from "@/lib/services/portfolios-service";

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  userRole: string;
}

export function PortfolioPreview({
  portfolio,
  userRole,
}: PortfolioPreviewProps) {

  function renderTemplate() {
    const title = portfolio.templateId?.title?.toLowerCase();

    switch (title) {
      case "tech developer":
        return (
          <MinimalDevTemplate
            portfolio={portfolio}
            userRole={userRole}
          />
        );

      case "creative design":
        return (
          <CreativeTemplate
            portfolio={portfolio}
          // userRole={userRole}
          />
        );
      //
      // case "minimalist":
      //   return (
      //     <MinimalistTemplate
      //       portfolio={portfolio}
      //       userRole={userRole}
      //     />
      //   );
      //
      // case "modern professional":
      //   return (
      //     <ModernTemplate
      //       portfolio={portfolio}
      //       userRole={userRole}
      //     />
      // );

      default:
        return (
          <MinimalDevTemplate
            portfolio={portfolio}
            userRole={userRole}
          />
        );
    }
  }

  return renderTemplate();
}
