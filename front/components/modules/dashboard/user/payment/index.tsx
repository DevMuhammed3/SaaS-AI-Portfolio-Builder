"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { devLog } from "@/lib/utils";

interface PaymentResult {
  success: boolean;
  message: string;
}

export default function PaymentSuccessPage({ id }: { id: string }) {
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth(); // inside a React component or hook
  const router = useRouter();
  useEffect(() => {
    const processPayment = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const response = await apiClient.post(
          "/api/user/payment/paypal",
          { id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResult(response.data);
      } catch (error) {
        devLog.error("Payment processing error:", error);

        setResult({
          success: false,
          message: "An error occurred while processing your payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      processPayment();
    }
  }, [id,getToken]);

  const handleLogout = async () => {
    router.push("/user");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600 text-center">
              Please wait while we verify your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {result?.success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">
                Payment Successful!
              </CardTitle>
              <CardDescription>
                Your account has been upgraded to Premium
              </CardDescription>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-600">
                Payment Failed
              </CardTitle>
              <CardDescription>
                There was an issue processing your payment
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-gray-700">{result?.message}</p>

          {result?.success ? (
            <div className="space-y-4">
              <Button onClick={handleLogout} className="w-full" size="lg">
                Dashboard
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">You now have access to:</p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li>• Unlimited portfolios</li>
                  <li>• Premium templates</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/user")}
                variant="outline"
                className="w-full"
              >
                Return to Dashboard
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
