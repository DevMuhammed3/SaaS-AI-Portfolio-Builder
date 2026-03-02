"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/custom/loading-spinner";

export default function CTA() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  return (
    <section className="relative py-28 bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Stop overthinking your portfolio.
          </h2>

          <p className="mt-6 text-muted-foreground text-lg">
            Build it today, publish instantly, and focus on getting hired.
          </p>

          <div className="mt-12 flex justify-center">
            {!isLoaded ? (
              <LoadingSpinner size="lg" />
            ) : isSignedIn ? (
              <Button
                size="lg"
                variant="primary"
                className="px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => router.push("/user/portfolios/new")}
              >
                Create New Portfolio
              </Button>
            ) : (
              <SignUpButton
                mode="modal"
                fallbackRedirectUrl="/user/portfolios/new"
              >
                <Button
                  size="lg"
                  variant="primary"
                  className="px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Build My Portfolio
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </Container>

      {/* subtle glow */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center">
        <div className="w-[500px] h-[300px] bg-primary/10 blur-3xl rounded-full" />
      </div>
    </section>
  );
}
