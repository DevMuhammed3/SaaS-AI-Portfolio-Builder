"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  User,
  ShoppingCart,
  CarIcon as CardIcon,
  CheckSquare,
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  StripePaymentForm,
  StripePaymentProvider,
} from "@/components/custom/stripe-payment-form";
import { useAuth } from "@clerk/nextjs";
import Container from "@/components/custom/container";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import { apiClient } from "@/lib/api-client";

declare global {
  interface Window {
    paypal: {
      Buttons: (options: PayPalButtonsOptions) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}
type PayPalButtonsOptions = {
  createOrder: (
    data: Record<string, unknown>,
    actions: PayPalCreateOrderActions
  ) => Promise<string>;
  onApprove: (
    data: Record<string, unknown>,
    actions: PayPalOnApproveActions
  ) => void;
  onError: (error: PayPalError) => void;
  onCancel: () => void;
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "blue" | "silver" | "white" | "black" | string;
    shape?: "pill" | "rect";
    label?: string;
  };
};
type PayPalCreateOrderActions = {
  order: {
    create: (options: {
      purchase_units: Array<{
        description: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    }) => Promise<string>;
  };
};

type PayPalOnApproveActions = {
  order: {
    capture: () => Promise<PayPalOrder>; // You can replace `any` with a custom `PayPalOrder` type if needed
  };
};

type PayPalError = {
  message?: string;
  name?: string;
};

type PayPalOrder = {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
  payer: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  [key: string]: unknown;
};

// Uncomment this to add PayPal support
// interface PayPalButtonProps {
//   amount: number;
//   onSuccess: (order: PayPalOrder) => void;
//   onError: (error: PayPalError) => void;
//   onCancel: () => void;
// }

interface StripePaymentIntent {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

interface FormData {
  fullName: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  country: string;
  postalCode: string;
  address: string;
  city: string;
  state: string;
}

interface StepData {
  number: number;
  title: string;
}

interface PaymentMethodCardProps {
  method: string;
  selectedMethod: string | null;
  onSelect: (method: string) => void;
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PayPalIcon = () => (
  <div className="flex items-center justify-center w-6 h-6 text-[#003087]">
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.067 8.478c.492.315.844.827.983 1.46.157.962-.078 2.22-.642 3.662-.563 1.442-1.398 2.613-2.435 3.397-1.037.784-2.103 1.057-3.183.9-.492-.315-.844-.827-.983-1.46-.157-.962.078-2.22.642-3.662.563-1.442 1.398-2.613 2.435-3.397 1.037-.784 2.103-1.057 3.183-.9zm-5.762 10.437l.297-1.896c.057-.39.399-.39.456 0l.297 1.896c.057.39-.285.39-.342 0l-.171-1.069-.171 1.069c-.057.39-.399.39-.456 0zm-2.263-.171l.741-1.725c.057-.114.228-.114.285 0l.741 1.725c.057.114-.057.228-.171.228h-.228c-.057 0-.114-.057-.171-.114l-.114-.285h-.57l-.114.285c0 .057-.114.114-.171.114h-.228c-.057 0-.171-.114-.114-.228zm.627-1.069l-.171.456h.342l-.171-.456zm-1.41 1.069l.741-1.725c.057-.114.228-.114.285 0l.741 1.725c.057.114-.057.228-.171.228h-.228c-.057 0-.114-.057-.171-.114l-.114-.285h-.57l-.114.285c0 .057-.114.114-.171.114h-.228c-.057 0-.171-.114-.114-.228zm.627-1.069l-.171.456h.342l-.171-.456zm-2.093 1.069h.285c.057 0 .114-.057.114-.114v-1.611c0-.057-.057-.114-.114-.114h-.285c-.057 0-.114.057-.114.114v1.611c0 .057.057.114.114.114zm-1.41 0h.285c.057 0 .114-.057.114-.114v-.969l.513.969c.057.057.114.114.171.114h.342c.057 0 .114-.057.114-.114v-1.611c0-.057-.057-.114-.114-.114h-.285c-.057 0-.114.057-.114.114v.969l-.513-.969c-.057-.057-.114-.114-.171-.114h-.342c-.057 0-.114.057-.114.114v1.611c0 .057.057.114.114.114z" />
    </svg>
  </div>
);

const ApplePayIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.72 17.25a6.824 6.824 0 0 1-.831 1.72c-.441.63-.801 1.068-1.08 1.311-.431.397-.893.601-1.384.611-.354 0-.781-.101-1.279-.306-.5-.203-.959-.304-1.378-.304-.44 0-.911.101-1.413.304-.503.205-.909.312-1.219.324-.472.02-.942-.189-1.412-.63-.301-.261-.678-.708-1.13-1.343-.484-.685-.883-1.48-1.196-2.382-.336-.97-.505-1.91-.505-2.819 0-1.042.225-1.941.675-2.697.353-.6.823-1.072 1.41-1.418.588-.345 1.224-.521 1.908-.532.375 0 .866.115 1.474.34.606.225 1 .34 1.17.34.128 0 .562-.134 1.304-.402.699-.247 1.29-.349 1.775-.308 1.31.106 2.295.622 2.952 1.55-1.172.71-1.752 1.706-1.741 2.986.01 1 .37 1.83 1.08 2.494.32.307.68.545 1.08.712-.087.251-.178.491-.276.72zM14.5 3.695c0 .784-.287 1.516-.859 2.194-.69.805-1.523 1.27-2.428 1.196a2.428 2.428 0 0 1-.018-.294c0-.747.325-1.546.902-2.194.289-.33.657-.604 1.102-.824.446-.216.867-.336 1.265-.358.011.1.018.2.018.3.01.027.01.054.01.08z" />
  </svg>
);

// Uncomment this to add PayPal support
// const PayPalButton: React.FC<PayPalButtonProps> = ({
//   amount,
//   onSuccess,
//   onError,
//   onCancel,
// }) => {
//   const paypalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&debug=true`;
//     script.async = true;

//     script.onload = () => {
//       if (paypalRef.current && window.paypal) {
//         try {
//           window.paypal
//             .Buttons({
//               createOrder: (
//                 _data: Record<string, unknown>,
//                 actions: PayPalCreateOrderActions
//               ) => {
//                 return actions.order.create({
//                   purchase_units: [
//                     {
//                       description: "10minportfolio Purchase",
//                       amount: {
//                         currency_code: "USD",
//                         value: amount.toFixed(2),
//                       },
//                     },
//                   ],
//                 });
//               },
//               onApprove: async (
//                 _data: Record<string, unknown>,
//                 actions: PayPalOnApproveActions
//               ) => {
//                 const order = await actions.order.capture();
//                 onSuccess(order);
//               },
//               onError: (err: PayPalError) => {
//                 console.error("PayPal Error:", err);
//                 onError(err);
//               },
//               onCancel: () => {
//                 onCancel();
//               },
//               style: {
//                 layout: "vertical",
//                 color: "blue",
//                 shape: "rect",
//                 label: "pay",
//               },
//             })
//             .render(paypalRef.current);
//         } catch (error) {
//           console.error("Error rendering PayPal buttons:", error);
//           toast.error("PayPal Error", {
//             description:
//               "There was an error loading PayPal. Please try again or choose another payment method.",
//           });
//         }
//       }
//     };

//     script.onerror = () => {
//       console.error("Failed to load PayPal SDK");
//       toast.error("PayPal Error", {
//         description:
//           "Failed to load PayPal. Please try again or choose another payment method.",
//       });
//     };

//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, [amount, onSuccess, onError, onCancel]);

//   return <div ref={paypalRef} className="mt-4"></div>;
// };

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps: StepData[] = [
    { number: 1, title: "Information" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Review" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span
              className={`text-xs mt-2 ${
                currentStep >= step.number
                  ? "text-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-24 h-1 mx-2 ${
                currentStep > index + 1 ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  selectedMethod,
  onSelect,
  icon,
  title,
  description,
  children,
}) => {
  const isSelected = selectedMethod === method;

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary-50" : "hover:border-gray-400"
      }`}
      onClick={() => onSelect(method)}
    >
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
            isSelected ? "border-primary" : "border-gray-400"
          }`}
        >
          {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
        </div>
        {icon}
        <span className="font-medium ml-2">{title}</span>
        {method === "stripe" && (
          <div className="ml-auto flex space-x-2">
            <div className="w-10 h-6 bg-blue-600 rounded"></div>
            <div className="w-10 h-6 bg-red-500 rounded"></div>
            <div className="w-10 h-6 bg-gray-800 rounded"></div>
          </div>
        )}
      </div>

      {isSelected && children && (
        <m.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t"
        >
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
          {children}
        </m.div>
      )}
    </div>
  );
};

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      placeholder={placeholder}
    />
  </div>
);

const SuccessPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <Container>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your courses are now available in your
          learning dashboard.
        </p>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/user">Go to My dashboard</Link>
          </Button>
        </div>
      </div>
    </Container>
  </div>
);

interface OrderSummaryProps {
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ total }) => (
  <div className="lg:col-span-1">
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <ShoppingCart className="h-5 w-5 mr-2" />
        Order Summary
      </h2>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>$0.00</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-600">
        <p className="flex items-center mb-2">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          Secure checkout
        </p>
        <p className="flex items-center mb-2">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          30-day money-back guarantee
        </p>
        <p className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          Lifetime access to premium content
        </p>
      </div>
    </div>
  </div>
);

export default function CheckoutPage({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const total = 99;
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  // Uncomment this to add PayPal support
  // const [paypalError, setPaypalError] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    fullName: firstName + " " + lastName || "",
    email: email || "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    country: "",
    postalCode: "",
    address: "",
    city: "",
    state: "",
  });
  const { getToken } = useAuth();

  // Set user data into form once loaded
  useEffect(() => {
    if (!email) {
      setFormData((prev) => ({
        ...prev,
        fullName: firstName + " " + lastName || "",
        email: email || "",
      }));
    }

    const fetchCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          country: data.country_name || "US",
        }));
      } catch (err) {
        console.error("Failed to fetch country:", err);
      }
    };

    fetchCountry();
  }, [email, firstName, lastName]);

  // Create Stripe payment intent when payment method is selected
  useEffect(() => {
    if (selectedPaymentMethod === "stripe" && !stripeClientSecret) {
      const createPaymentIntent = async () => {
        try {
          const response = await apiClient.post(
            "/api/user/stripe/create-payment-intent",
            {
              amount: total,
              metadata: {
                customer_email: formData.email,
                customer_name: formData.fullName,
                customer_country: formData.country,
                customer_city: formData.city,
                customer_address: formData.address,
                customer_state: formData.state,
                customer_postalCode: formData.postalCode,
              },
            }
          );
          const data = await response.data;
          toast.success("You can proceed to payment.", {
            description: "A secure payment intent was created successfully.",
          });
          setStripeClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error creating Stripe payment intent:", error);
          setStripeError("Failed to initialize Stripe. Please try again.");
          toast.error("Stripe Error", {
            description:
              "Failed to initialize Stripe. Please try again or choose another payment method.",
          });
        }
      };

      createPaymentIntent();
    }
  }, [selectedPaymentMethod, total, formData, stripeClientSecret, getToken]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    // Uncomment this to add PayPal support
    // setPaypalError(null);
    setStripeError(null);
  };

  // Uncomment this to add PayPal support
  // const handlePayPalSuccess = async (details: PayPalOrder) => {
  //   console.log("PayPal payment successful:", details);
  //   toast.success("Payment Successful", {
  //     description: `Transaction ID: ${details.id}`,
  //   });
  //   setIsProcessing(false);
  //   setIsComplete(true);
  // };

  // // Handle PayPal error
  // const handlePayPalError = (error: PayPalError) => {
  //   console.error("PayPal payment error:", error);
  //   setPaypalError(
  //     "There was an error processing your payment. Please try again."
  //   );
  //   setIsProcessing(false);
  //   toast.error("Payment Failed", {
  //     description:
  //       "There was an error processing your payment. Please try again.",
  //   });
  // };

  // // Handle PayPal cancel
  // const handlePayPalCancel = () => {
  //   console.log("PayPal payment cancelled");
  //   setPaypalError("Payment was cancelled. Please try again.");
  //   setIsProcessing(false);
  //   toast.info("Payment Cancelled", {
  //     description:
  //       "You cancelled the payment process. You can try again when ready.",
  //   });
  // };

  // Handle Stripe success
  const handleStripeSuccess = (paymentIntent: StripePaymentIntent) => {
    console.log("Stripe payment successful:", paymentIntent);
    setIsProcessing(false);
    setIsComplete(true);
  };

  // Handle Stripe error
  const handleStripeError = (error: unknown) => {
    const message =
      "There was an error processing your payment. Please try again.";

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as Error).message === "string"
    ) {
      console.error("Stripe payment error:", (error as Error).message);
    } else {
      console.error("Stripe payment error (unknown):", error);
    }

    setStripeError(message);
    setIsProcessing(false);
  };

  // Handle form submission for credit card
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isComplete) {
    return <SuccessPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <StepIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <m.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-medium mb-6 flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Customer Information
                    </h2>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          id="fullName"
                          name="fullName"
                          type="text"
                          label="Full Name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                          readOnly
                        />
                        <FormField
                          id="email"
                          name="email"
                          type="email"
                          label="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          required
                          readOnly
                        />
                      </div>

                      <FormField
                        id="country"
                        name="country"
                        type="text"
                        label="Country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter your country"
                        required
                        readOnly
                      />

                      <FormField
                        id="address"
                        name="address"
                        type="text"
                        label="Address (optional)"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          id="city"
                          name="city"
                          type="text"
                          label="City (optional)"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                        />
                        <FormField
                          id="state"
                          name="state"
                          type="text"
                          label="State/Province (optional)"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                        />
                        <FormField
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          label="Postal Code (optional)"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={goToNextStep}
                        className="flex items-center"
                        disabled={
                          !formData.fullName ||
                          !formData.email ||
                          !formData.country
                        }
                      >
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </m.div>
                )}

                {currentStep === 2 && (
                  <m.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-medium mb-6 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      <PaymentMethodCard
                        method="stripe"
                        selectedMethod={selectedPaymentMethod}
                        onSelect={handlePaymentMethodSelect}
                        icon={<CardIcon className="h-5 w-5 text-gray-700" />}
                        title="Credit / Debit Card"
                      >
                        {stripeError && (
                          <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-800">
                            {stripeError}
                          </div>
                        )}

                        {stripeClientSecret ? (
                          <StripePaymentProvider
                            clientSecret={stripeClientSecret}
                            amount={total}
                            onSuccess={handleStripeSuccess}
                            onError={handleStripeError}
                          >
                            <StripePaymentForm
                              amount={total}
                              onSuccess={handleStripeSuccess}
                              onError={handleStripeError}
                            />
                          </StripePaymentProvider>
                        ) : (
                          <div className="flex items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2 text-sm text-gray-600">
                              Loading payment form...
                            </span>
                          </div>
                        )}
                      </PaymentMethodCard>

                      {/* uncomment this to add PayPay */}
                      {/* <PaymentMethodCard
                        method="paypal"
                        selectedMethod={selectedPaymentMethod}
                        onSelect={handlePaymentMethodSelect}
                        icon={<PayPalIcon />}
                        title="PayPal"
                        description="Pay securely using your PayPal account or credit card through PayPal."
                      >
                        {paypalError && (
                          <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-800">
                            {paypalError}
                          </div>
                        )}

                        <PayPalButton
                          amount={total}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                          onCancel={handlePayPalCancel}
                        />
                      </PaymentMethodCard> */}

                      {/* uncomment this to add ApplePay */}
                      {/* <PaymentMethodCard
                        method="apple-pay"
                        selectedMethod={selectedPaymentMethod}
                        onSelect={handlePaymentMethodSelect}
                        icon={<ApplePayIcon />}
                        title="Apple Pay"
                      >
                        <p className="text-sm text-gray-600">
                          You will be prompted to authorize payment using Apple
                          Pay.
                        </p>
                        <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm text-gray-800">
                          <p>
                            Apple Pay allows you to make secure purchases using
                            the payment methods stored on your Apple devices.
                          </p>
                        </div>
                      </PaymentMethodCard> */}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="flex items-center bg-transparent"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={goToNextStep}
                        className="flex items-center"
                        disabled={!selectedPaymentMethod}
                      >
                        Review Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </m.div>
                )}

                {currentStep === 3 && (
                  <m.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-medium mb-6 flex items-center">
                      <CheckSquare className="mr-2 h-5 w-5" />
                      Review Order
                    </h2>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">
                          Customer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p>{formData.fullName || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p>{formData.email || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Address</p>
                            <p>{formData.address || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p>
                              {[
                                formData.city,
                                formData.state,
                                formData.postalCode,
                                formData.country,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <div className="flex items-center">
                          {selectedPaymentMethod === "stripe" && (
                            <>
                              <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                              <div>
                                <p>Credit/Debit Card (Stripe)</p>
                                <p className="text-sm text-gray-500">
                                  Secure payment via Stripe
                                </p>
                              </div>
                            </>
                          )}

                          {selectedPaymentMethod === "paypal" && (
                            <>
                              <PayPalIcon />
                              <div className="ml-2">
                                <p>PayPal</p>
                                <p className="text-sm text-gray-500">
                                  You&apos;ll be redirected to PayPal
                                </p>
                              </div>
                            </>
                          )}

                          {selectedPaymentMethod === "apple-pay" && (
                            <>
                              <ApplePayIcon />
                              <div className="ml-2">
                                <p>Apple Pay</p>
                                <p className="text-sm text-gray-500">
                                  You&apos;ll be prompted to authorize payment
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="flex items-center bg-transparent"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      {selectedPaymentMethod === "paypal" ? (
                        <Button
                          onClick={goToPreviousStep}
                          className="flex items-center"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : `Pay with PayPal`}
                          {!isProcessing && (
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ) : selectedPaymentMethod === "stripe" ? (
                        <Button
                          onClick={goToPreviousStep}
                          className="flex items-center"
                        >
                          Complete Payment with Stripe
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          className="flex items-center"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : `Complete Payment`}
                          {!isProcessing && (
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <OrderSummary total={total} />
        </div>
      </Container>

      {selectedPaymentMethod === "stripe" && stripeClientSecret && (
        <div className="hidden">
          <StripePaymentProvider
            clientSecret={stripeClientSecret}
            amount={total}
            onSuccess={handleStripeSuccess}
            onError={handleStripeError}
          >
            <div />
          </StripePaymentProvider>
        </div>
      )}
    </div>
  );
}
