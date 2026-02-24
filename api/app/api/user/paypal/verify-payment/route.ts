import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { auth as Auth, clerkClient } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";
import isEqual from "lodash.isequal";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  const { userId } = await Auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }
  const { orderId } = await request.json();

  // Get PayPal access token
  const { data: auth } = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID!,
        password: process.env.PAYPAL_SECRET!,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  // Verify order
  const { data: order } = await axios.get(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
    {
      headers: { Authorization: `Bearer ${auth.access_token}` },
    }
  );

  if (order.status === "COMPLETED") {
    let clerk = null;
    const clerkAwait = await clerkClient();
    devLog.error(`Fetching Clerk user with id: ${userId}`);
    clerk = await clerkAwait.users.getUser(userId);
    devLog.error("Clerk user fetched:", clerk);

    const newPrivateMetadata = {
      plan: "premium",
      upgradedAt: new Date().toISOString(),
      subscription: {
        status: "active",
        plan: "premium",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    };

    const mergedPrivateMetadata = {
      ...clerk.privateMetadata,
      ...newPrivateMetadata, // this will overwrite plan if it exists, but preserve fields like `role`
    };

    const shouldUpdate = clerk
      ? !isEqual(clerk.privateMetadata, mergedPrivateMetadata)
      : false;

    if (shouldUpdate) {
      try {
        await clerkAwait.users.updateUser(userId, {
          privateMetadata: mergedPrivateMetadata,
        });
        devLog.error("Clerk user privateMetadata updated");
      } catch (updateError) {
        devLog.error(
          "Failed to update Clerk user privateMetadata:",
          updateError
        );
      }
    } else {
      devLog.error("No privateMetadata update needed");
    }
    // ✅ MongoDB update logic
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
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
      devLog.error("✅ User updated in MongoDB");
    }

    return Response.json({ success: true, order });
  } else {
    return Response.json({ success: false, order }, { status: 400 });
  }
}
