"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Sparkles, Eye } from "lucide-react";
import { m } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PremiumAccessModalProps {
  userRole: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PremiumAccessModal({
  userRole,
  isOpen,
  onOpenChange,
}: PremiumAccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isPremium = userRole === "premium";

  // Don't show modal if user is premium
  if (isPremium) return null;

  const features = [
    {
      icon: Crown,
      title: "Premium Templates",
      description: "Access to exclusive portfolio templates and themes",
    },
    {
      icon: Zap,
      title: "Advanced Analytics",
      description: "Detailed visitor insights and performance metrics",
    },
    {
      icon: Eye,
      title: "View public portfolio",
      description: "Access all public portfolios and interact with people.",
    },
    {
      icon: Sparkles,
      title: "Priority Support",
      description: "24/7 premium support and faster response times",
    },
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-300" />
              <Badge
                variant="secondary"
                className="bg-yellow-300 text-purple-900 font-semibold"
              >
                Premium Required
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold">
              Unlock Premium Portfolio Features
            </DialogTitle>
            <p className="text-purple-100 mt-2">
              Upgrade to premium to access advanced portfolio features and
              customization options.
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Premium Plan</h3>
                <p className="text-sm text-gray-600">
                  Full access to all portfolio features
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">$4</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
              asChild
            >
              <Link
                target="_blank"
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LNU26K7WCDE3C"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                router.back();
                onOpenChange(true);
              }}
              className="sm:w-auto"
            >
              No thanks
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <feature.icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <CardTitle className="text-sm font-semibold">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
