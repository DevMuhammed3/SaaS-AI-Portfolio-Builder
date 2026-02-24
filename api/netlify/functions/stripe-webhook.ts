import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import type { Handler } from "@netlify/functions";
import { devLog } from "@/lib/utils";
import { userRepository } from "@/repositories/UserRepository";
import connectDB from "@/lib/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event) => {
  await connectDB();

  const sig = event.headers["stripe-signature"];
  let stripeEvent: Stripe.Event;

  try {
    const rawBody = event.body;
    if (!rawBody || !sig) {
      return { statusCode: 400, body: "Missing body or signature" };
    }

    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log("Webhook type:", stripeEvent.type);
  } catch (err) {
    devLog.error("❌ Webhook Error:", err);
    return {
      statusCode: 400,
      body: `Webhook Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }

  try {
    switch (stripeEvent.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

        const {
          customer_email,
          customer_name,
          customer_country,
          customer_city,
          customer_address,
          customer_state,
          customer_postalCode,
        } = paymentIntent.metadata || {};

        if (!customer_email) {
          devLog.error("❌ No email in payment metadata");
          return {
            statusCode: 400,
            body: "Missing customer_email in metadata",
          };
        }

        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({
          emailAddress: [customer_email],
        });

        const user = users.data[0];
        if (!user) {
          return { statusCode: 404, body: "User not found in Clerk" };
        }

        const existingUser = await clerk.users.getUser(user.id);

        // Update Clerk metadata
        await clerk.users.updateUser(user.id, {
          privateMetadata: {
            ...existingUser.privateMetadata,
            plan: "premium",
            upgradedAt: new Date().toISOString(),
            billingInfo: {
              name: customer_name,
              country: customer_country,
              city: customer_city,
              address: customer_address,
              state: customer_state,
              postalCode: customer_postalCode,
              paidAt: new Date().toISOString(),
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              paymentIntentId: paymentIntent.id,
            },
          },
        });

        const updatedUser = await userRepository.updateByClerkId(user.id, {
          plan: "premium",
          status: "active",
          updatedAt: new Date(),
        });

        // For debug in netlify
        if (!updatedUser) {
          console.warn("⚠️ User not found in DB, but Clerk updated");
        } else {
          console.warn("✅ User updated in MongoDB");
        }

        break;
      }

      default:
        console.warn(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("❌ Processing error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
