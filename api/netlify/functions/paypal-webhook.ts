import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";

interface PayPalAmount {
  currency_code: string;
  value: string;
}

interface PayPalPayer {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
  address?: {
    country_code?: string;
  };
}

interface PayPalPaymentResource {
  id: string;
  status: string;
  amount: PayPalAmount;
  payer?: PayPalPayer;
  create_time?: string;
  update_time?: string;
  invoice_id?: string;
  custom_id?: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  // Add more fields if needed
}

// PayPal webhook event types
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  create_time: string;
  resource_type: string;
  resource: PayPalPaymentResource;
  summary: string;
}

// Verify PayPal webhook signature
function verifyPayPalSignature(
  payload: string,
  headers: Headers,
  webhookSecret: string
): boolean {
  const signature = headers.get("paypal-transmission-sig");
  const certId = headers.get("paypal-cert-id");
  const transmissionId = headers.get("paypal-transmission-id");
  const timestamp = headers.get("paypal-transmission-time");
  const authAlgo = headers.get("paypal-auth-algo");

  if (!signature || !certId || !transmissionId || !timestamp || !authAlgo) {
    return false;
  }

  // For production, you should verify against PayPal's certificate
  // This is a simplified version using webhook secret
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "base64"),
    Buffer.from(expectedSignature, "base64")
  );
}

export async function handler(request: NextRequest) {
  try {
    const payload = await request.text();
    const headers = request.headers;

    // Get webhook secret from environment variables
    const webhookSecret = process.env.PAYPAL_WEBHOOK_SECRET;
    if (!webhookSecret) {
      devLog.error("PayPal webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!verifyPayPalSignature(payload, headers, webhookSecret)) {
      devLog.error("Invalid PayPal webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook event
    const event: PayPalWebhookEvent = JSON.parse(payload);

    devLog.warn(`Received PayPal webhook: ${event.event_type}`);

    // Handle different event types
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCompleted(event);
        break;

      default:
        devLog.warn(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    devLog.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Event handlers
async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  const payment = event.resource;

  devLog.warn("Payment completed:", {
    id: payment.id,
    amount: payment.amount?.value,
    currency: payment.amount?.currency_code,
    payerEmail: payment.payer?.email_address,
  });

  // TODO: Update your database with successful payment
  // Example: Update order status, send confirmation email, etc.
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({
    emailAddress: [payment.payer?.email_address || ""],
  });

  const user = users.data[0];
  if (!user) {
    return { statusCode: 404, body: "User not found in Clerk" };
  }

  const existingUser = await clerk.users.getUser(user.id);

  // ✅ Update Clerk metadata
  await clerk.users.updateUser(user.id, {
    privateMetadata: {
      ...existingUser.privateMetadata,
      plan: "premium",
      upgradedAt: new Date().toISOString(),
      billingInfo: payment,
    },
  });

  // ✅ Update MongoDB
  const updatedUser = await User.findOneAndUpdate(
    { clerkId: user.id },
    {
      plan: "premium",
      status: "active",
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedUser) {
    devLog.warn("⚠️ User not found in DB, but Clerk updated");
  } else {
    devLog.warn("✅ User updated in MongoDB");
  }
}
