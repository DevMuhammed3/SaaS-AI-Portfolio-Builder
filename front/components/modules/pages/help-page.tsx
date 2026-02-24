"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LocaleLink } from "@/components/custom/locale-link";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  Users,
  HelpCircle,
} from "lucide-react";
import { m } from "framer-motion";
import { useState } from "react";
import BackButton from "@/components/custom/back";
import ContactForm from "@/components/custom/contact-form";

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

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleClick = () => {
    const target = document.getElementById("send");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  const faqs = [
    {
      question: "How do I create my first portfolio?",
      answer:
        "Getting started is easy! Click 'Create Portfolio' from your dashboard, choose a template, and follow our step-by-step wizard. You'll be guided through adding your profile information, experience, projects, and skills.",
    },
    {
      question: "Can I customize the design of my portfolio?",
      answer:
        "You can customize colors, fonts, layouts, and sections. Premium users get access to advanced customization options and exclusive templates.",
    },
    {
      question: "How do I make my portfolio public?",
      answer:
        "Once you're happy with your portfolio, click the 'Publish' button. You'll get a unique URL that you can share with employers, clients, or on social media.",
    },
    {
      question: "What's the difference between free and premium plans?",
      answer:
        "Free users can create up to 1 portfolio with basic templates. Premium users get unlimited portfolios, advanced templates, analytics, and priority support.",
    },
    {
      question: "Can I export my portfolio?",
      answer:
        "Yes! Premium users can export their portfolios as PDF or HTML files. This is perfect for offline sharing or creating backup copies.",
    },
    {
      question: "How do I add projects to my portfolio?",
      answer:
        "In the portfolio editor, go to the 'Projects' section. Click 'Add Project' and fill in the details including title, description, technologies used, and links to live demos or repositories.",
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      title: "Starter Guide",
      description: "Complete walkthrough for new users",
      link: "/docs",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      link: "https://www.youtube.com/@sylvaincodes593/playlists",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Detailed feature documentation",
      link: "/docs",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other users",
      link: "https://www.patreon.com/messages/8b25e025c56c4d47a903cd9b02049c63?mode=campaign&tab=chats",
    },
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
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </m.div>
          <m.h1 className="mb-6" variants={fadeInUp}>
            Help & Support
          </m.h1>
          <m.p
            className="text-xl text-slate-600 dark:text-slate-400  max-w-3xl mx-auto mb-8"
            variants={fadeInUp}
          >
            We&apos;re here to help you create amazing portfolios. Find answers,
            get support, and learn new tips.
          </m.p>

          {/* Search Bar */}
          <m.div className="max-w-2xl mx-auto relative" variants={fadeInUp}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </m.div>
        </m.div>

        {/* Quick Help Cards */}
        <m.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div variants={fadeInUp}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="mb-4">Live Chat</h4>
                <p className="text-slate-600 dark:text-slate-400  mb-6">
                  Get instant help from our team
                </p>
                <Button className="w-full" onClick={handleClick}>
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </m.div>

          <m.div variants={fadeInUp}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="mb-4">Email Support</h4>
                <p className="text-slate-600 dark:text-slate-400  mb-6">
                  Send us a detailed message
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleClick}
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </m.div>

          <m.div variants={fadeInUp}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="mb-4">Phone Support</h4>
                <p className="text-slate-600 dark:text-slate-400  mb-6">
                  Call us for urgent issues
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleClick}
                >
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </m.div>
        </m.div>

        {/* Resources Section */}
        <m.div
          className="mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-slate-900 dark:text-slate-200 mb-4">
              Helpful Resources
            </h2>
            <p className="text-slate-600 dark:text-slate-400  max-w-2xl mx-auto">
              Explore our comprehensive resources to get the most out of your
              portfolio.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <m.div key={index} variants={fadeInUp}>
                <LocaleLink href={resource.link}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <resource.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 " />
                      </div>
                      <h5 className="mb-2">
                        {resource.title}
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 ">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                </LocaleLink>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* FAQ Section */}
        <m.div
          className="mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400  max-w-2xl mx-auto">
              Find quick answers to the most common questions about our
              platform.
            </p>
          </m.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <m.div key={index} variants={fadeInUp}>
                <Card className="border-0 shadow-lg">
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                  >
                    <CardTitle className="flex items-center justify-between text-lg">
                      {faq.question}
                      {expandedFaq === index ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  {expandedFaq === index && (
                    <CardContent className="pt-0">
                      <p className="text-slate-600 dark:text-slate-400  leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Contact Form */}
        <ContactForm />
      </Container>
    </div>
  );
}
