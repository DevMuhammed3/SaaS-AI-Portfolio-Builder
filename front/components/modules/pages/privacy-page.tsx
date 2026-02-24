"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { m } from "framer-motion";
import Container from "@/components/custom/container";
import BackButton from "@/components/custom/back";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function PrivacyPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, build a portfolio, or contact us for support. This includes your name, email address, profile information, and portfolio content.",
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our service, including your IP address, browser type, pages visited, and interaction patterns to improve our platform.",
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the device you use to access our service, including device type, operating system, and unique device identifiers.",
        },
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our portfolio building service, including creating and hosting your portfolios.",
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you service-related notifications, updates, and respond to your inquiries.",
        },
        {
          subtitle: "Analytics & Improvement",
          text: "We analyze usage patterns to understand how our service is used and to make improvements to user experience and functionality.",
        },
      ],
    },
    {
      icon: UserCheck,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Public Portfolios",
          text: "When you publish a portfolio, the information you choose to include becomes publicly accessible via your portfolio URL.",
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who assist us in operating our platform, such as hosting and analytics services.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law or to protect our rights, property, or safety, or that of our users or others.",
        },
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your data both in transit and at rest. All communications with our servers are secured using SSL/TLS encryption.",
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls and authentication measures to ensure only authorized personnel can access user data.",
        },
        {
          subtitle: "Regular Audits",
          text: "We regularly review and update our security practices and conduct security audits to identify and address potential vulnerabilities.",
        },
      ],
    },
  ];

  const rights = [
    "Access and review your personal information",
    "Correct inaccurate or incomplete information",
    "Delete your account and associated data",
    "Export your portfolio data",
    "Opt out of marketing communications",
    "Request information about data processing",
  ];

  return (
    <div className="min-h-screen">
      <Container className="py-16">
        <BackButton />
        {/* Hero Section */}
        <m.div
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div
            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
            variants={fadeInUp}
          >
            <Shield className="w-10 h-10 text-blue-600" />
          </m.div>
          <m.h1 className="mb-6" variants={fadeInUp}>
            Privacy Policy
          </m.h1>
          <m.p
            className="text-xl text-slate-600 dark:text-slate-200 max-w-3xl mx-auto mb-4"
            variants={fadeInUp}
          >
            We take your privacy seriously. This policy explains how we collect,
            use, and protect your personal information.
          </m.p>
          <m.p className="text-sm text-gray-500" variants={fadeInUp}>
            Last updated: {lastUpdated}
          </m.p>
        </m.div>

        {/* Introduction */}
        <m.div
          className="mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h3 className="mb-6">Our Commitment to Privacy</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  At , we believe privacy is a fundamental right. This Privacy
                  Policy describes how we collect, use, and share information
                  about you when you use our portfolio building platform and
                  related services.
                </p>
                <p className="text-slate-600 dark:text-slate-400  leading-relaxed mb-4">
                  By using our service, you agree to the collection and use of
                  information in accordance with this policy. We will not use or
                  share your information except as described in this Privacy
                  Policy.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@10minportfolio.art
                </p>
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* Main Sections */}
        <m.div
          className="space-y-12 mb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {sections.map((section, index) => (
            <m.div key={index} variants={fadeInUp}>
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <section.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h6 className="mb-2">{item.subtitle}</h6>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>

        {/* Your Rights Section */}
        <m.div
          className="mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                You have several rights regarding your personal information. You
                can exercise these rights by contacting us or using the settings
                in your account dashboard.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {rights.map((right, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600 dark:text-slate-400">
                      {right}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* Cookies Section */}
        <m.div
          className="mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="mb-4">
                Cookies and Tracking
              </h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  We use cookies and similar tracking technologies to enhance
                  your experience on our platform. Cookies help us remember your
                  preferences, analyze site traffic, and provide personalized
                  content.
                </p>
                <p>
                  You can control cookie settings through your browser
                  preferences. However, disabling certain cookies may limit some
                  functionality of our service.
                </p>
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* Contact Section */}
        <m.div
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle
            your data, we&apos;re here to help. Contact our privacy team
            anytime.
          </p>
          <div className="space-y-2">
            <p className="text-lg">Email: privacy@10minportfolio.app</p>
            <p className="text-sm opacity-75">
              We typically respond within 24 hours
            </p>
          </div>
        </m.div>

        {/* Updates Notice */}
        <m.div
          className="mt-12 text-center"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Card className="border-0 shadow-lg bg-yellow-50">
            <CardContent className="p-6">
              <h4 className="mb-2 dark:text-black">Policy Updates</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the Last updated date.
              </p>
            </CardContent>
          </Card>
        </m.div>
      </Container>
    </div>
  );
}
