import { type NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import isEqual from "lodash.isequal";
import User from "@/models/User";
import connectDB from "@/lib/database"; // make sure this exists
import { devLog } from "@/lib/utils";

/**
 * @swagger
 * /api/user/payments/paypal:
 *   post:
 *     summary: Verify a PayPal payment and upgrade user account to Premium
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payment ID received from the client for verification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Payment ID to verify
 *                 example: PAYPAL123456
 *     responses:
 *       200:
 *         description: Payment verified and user upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment successful! Your account is now Premium. Enjoy the benefits!
 *       400:
 *         description: Invalid payment verification or missing payment ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid payment verification
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again or contact support.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB(); // ✅ Ensure DB is connected early

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Payment ID is required" },
        { status: 400 }
      );
    }

    const paypalSecretKey = process.env.PAYPAL_SECRET_KEY;
    if (!paypalSecretKey) {
      devLog.error("Missing PAYPAL_SECRET_KEY env var");
      return NextResponse.json(
        { success: false, message: "Payment config error" },
        { status: 500 }
      );
    }

    if (id !== paypalSecretKey) {
      return NextResponse.json(
        { success: false, message: "Invalid payment verification" },
        { status: 400 }
      );
    }

    // ✅ Clerk update logic

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

    return NextResponse.json({
      success: true,
      message:
        "Payment successful! Your account is now Premium. Enjoy the benefits!",
    });
  } catch (error) {
    devLog.error("❌ Payment processing error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An unexpected error occurred. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
