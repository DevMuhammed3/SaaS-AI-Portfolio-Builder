"use client";

import type React from "react";
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeElementsOptions,
  type StripeError,
  type Appearance,
} from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StripePaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripePaymentProviderProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntent: StripePaymentIntent) => void;
  onError: (error: StripeError | unknown) => void;
  children: React.ReactNode;
}

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: StripePaymentIntent) => void;
  onError: (error: StripeError | unknown) => void;
}

// Wrapper component that provides the Stripe context
export function StripePaymentProvider({
  clientSecret,
  children,
}: StripePaymentProviderProps) {
  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0F172A",
      colorBackground: "#ffffff",
      colorText: "#1e293b",
      colorDanger: "#ef4444",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "6px",
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

// The actual payment form component
export function StripePaymentForm({
  amount,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred with your payment");
        onError(error);
        toast.error("Payment Failed", {
          description: error.message || "An error occurred with your payment",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment Successful", {
          description: `Payment of $${amount.toFixed(2)} was successful!`,
        });
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred");
      onError(error);
      toast.error("Payment Error", {
        description: "An unexpected error occurred during payment processing",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full py-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
