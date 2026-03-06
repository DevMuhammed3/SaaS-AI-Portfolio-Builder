"use client";

import React, { memo, useCallback } from "react";
import BackButton from "@/components/custom/back";
import Container from "@/components/custom/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plan } from "@/types";
import { Check, Crown, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "1 Portfolio",
      "Basic Templates",
      "No Support",
      "Basic Analytics",
      "Basic SEO Optimization",
      "No export Options",
    ],
    icon: Users,
    popular: false,
    buttonText: "Get started free",
    buttonVariant: "outline" as const,
    link: "/checkout",
  },
  {
    name: "Lifetime Access",
    price: 99,
    description: "Everything you need to stand out",
    features: [
      "Unlimited Portfolio",
      "Premium Templates",
      "Priority Support",
      "Advanced Analytics",
      "SEO Optimization",
      "Export Options",
    ],
    icon: Crown,
    popular: true,
    buttonText: "Start Lifetime Access",
    buttonVariant: "default" as const,
    link: "/checkout",
  },
];

export default function PricingPage({ acc }: { acc: Plan }) {
  return (
    <div className="h-screen py-16">
      <Container>
        <BackButton />
        <div className="m-10 text-center">
          <h3 className="mb-6">Choose Your Perfect Plan</h3>
          <p>
            Start building professional portfolios today. Upgrade anytime to
            unlock premium features.
          </p>
        </div>

        <div className="grid gap-12 max-w-4xl mx-auto mb-20 md:grid-cols-2">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} acc={acc} />
          ))}
        </div>
      </Container>
    </div>
  );
}

// Memoized PricingCard
const PricingCard = memo(
  ({ plan, acc }: { plan: (typeof plans)[number]; acc: Plan }) => {
    const router = useRouter();
    const Icon = plan.icon;

    // Memoize click handler so reference doesn't change
    const handleClick = useCallback(() => {
      if (acc === "free" && plan.link) {
        router.push(plan.link);
      }
    }, [acc, plan.link, router]);

    return (
      <Card
        className={cn(
          "relative h-full",
          plan.popular
            ? "border-primary-500 shadow-xl scale-105"
            : "border-slate-200"
        )}
      >
        {plan.popular && (
          <div className="absolute -top4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-primary-600 to-white text-white px-4 py-1">
              Most popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center">
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4",
              plan.popular
                ? "bg-gradient-to-r from-primary-600 to-purple-600"
                : "bg-slate-100"
            )}
          >
            <Icon
              className={cn(
                "w-8",
                plan.popular ? "text-white" : "text-slate-600"
              )}
            />
          </div>
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-400">
              ${plan.price}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleClick}
            variant={plan.buttonVariant}
            className={cn(
              "w-full text-slate-50",
              plan.popular
                ? "bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-800 hover:to-primary-600 transition-colors duration-300 ease-in-out"
                : ""
            )}
          >
            {acc === "premium" ? "Already a member" : plan.buttonText}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

PricingCard.displayName = "PricingCard";
