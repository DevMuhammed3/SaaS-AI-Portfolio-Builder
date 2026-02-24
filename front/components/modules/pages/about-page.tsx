"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocaleLink } from "@/components/custom/locale-link";
import {
  Users,
  Target,
  Lightbulb,
  Award,
  ArrowRight,
  Mail,
  Wheat,
} from "lucide-react";
import { m } from "framer-motion";
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

export function AboutPage() {
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
            <Wheat className="w-10 h-10 text-blue-600" />
          </m.div>
          <m.h1
            className="mb-6"
            variants={fadeInUp}
          >
            About
          </m.h1>
          <m.p
            className="text-xl text-slate-600 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            We believe every professional deserves a stunning portfolio that
            showcases their unique talents and opens doors to new opportunities.
          </m.p>
        </m.div>

        {/* Mission Section */}
        <m.div
          className="mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div className="text-center mb-12" variants={fadeInUp}>
            <h3 className="mb-4">
              Our Mission
            </h3>
            <p className="text-slate-600 dark:text-slate-200 max-w-2xl mx-auto">
              Empowering professionals to create beautiful, impactful portfolios
              that tell their story and advance their careers.
            </p>
          </m.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Purpose-Driven",
                description:
                  "Every feature we build serves one goal: helping you succeed in your career journey.",
              },
              {
                icon: Lightbulb,
                title: "Innovation First",
                description:
                  "We constantly innovate to provide cutting-edge tools that keep you ahead of the curve.",
              },
              {
                icon: Users,
                title: "Community Focused",
                description:
                  "Building a supportive community where professionals can learn, grow, and inspire each other.",
              },
            ].map((item, index) => (
              <m.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h5 className="mb-4">
                      {item.title}
                    </h5>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Stats Section */}
        <m.div
          className="mb-20 bg-white rounded-2xl shadow-lg p-12"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Portfolios Created" },
              { number: "50+", label: "Templates Available" },
              { number: "95%", label: "User Satisfaction" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </m.div>

        {/* Values Section */}
        <m.div
          className="mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <m.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we
              make.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Simplicity",
                description:
                  "We believe powerful tools should be simple to use. Complex problems deserve elegant solutions.",
              },
              {
                title: "Quality",
                description:
                  "Every template, every feature, every interaction is crafted with attention to detail and user experience.",
              },
              {
                title: "Accessibility",
                description:
                  "Professional portfolio creation should be accessible to everyone, regardless of technical skill level.",
              },
              {
                title: "Growth",
                description:
                  "We're committed to continuous improvement, both for our platform and our users' success.",
              },
            ].map((value, index) => (
              <m.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* CTA Section */}
        <m.div
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Award className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have already created stunning
            portfolios with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocaleLink href="/user/portfolios/new">
              <Button size="lg" variant="secondary" className="group">
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/help">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Mail className="mr-2 w-4 h-4" />
                Contact Us
              </Button>
            </LocaleLink>
          </div>
        </m.div>
      </Container>
    </div>
  );
}
