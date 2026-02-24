import { authGuard } from "@/lib/authGuard";
import { userSchema, UserUpdateInput } from "@/lib/validations/user";
import { type NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { userRepository } from "@/repositories/UserRepository";
import * as Sentry from "@sentry/nextjs";
import connectDB from "@/lib/database";
import { devLog } from "@/lib/utils";

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               plan:
 *                 type: string
 *                 enum: [free, premium]
 *                 example: premium
 *               status:
 *                 type: string
 *                 enum: [active, banned, suspended]
 *                 example: active
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   description: Updated user object
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: validation error
 *                 errors:
 *                   type: object
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User account deleted successfully or no user found
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
 *                   example: User account deleted.
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// GET /api/user/[id] - Get user by ID
export async function GET() {
  try {
    // Connect to MongoDB before performing DB actions
    await connectDB();
    // Run the auth guard to ensure the user is logged in and authorized
    const { userId } = await authGuard({ requireAdmin: false });

    // Validate that user can only access their own data or admin can access any
    const currentUser = await userRepository.findByClerkId(userId);
    if (!currentUser) {
      devLog.error("User not found:");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: currentUser,
        message: "User fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    devLog.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Authentifaction auth
    const { userId } = await authGuard({ requireAdmin: false });
    await connectDB(); // Ensure DB is connected

    // Get the request body
    const body = await req.json();

    // Server side validation
    const validatedFields = userSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Static typing
    const data: UserUpdateInput = validatedFields.data;

    //Update user using repository
    const updatedUser = await userRepository.updateByClerkId(userId, data);

    // Response
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // if (data.plan) {
    //   let clerk = null;
    //   const clerkAwait = await clerkClient();
    //   devLog.error(`Fetching Clerk user with id: ${userId}`);
    //   clerk = await clerkAwait.users.getUser(userId);
    //   devLog.error("Clerk user fetched:", clerk);

    //   const newPrivateMetadata = {
    //     plan: "premium",
    //     upgradedAt: new Date().toISOString(),
    //     subscription: {
    //       status: "active",
    //       plan: "premium",
    //       currentPeriodStart: new Date(),
    //       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    //     },
    //   };

    //   const mergedPrivateMetadata = {
    //     ...clerk.privateMetadata,
    //     ...newPrivateMetadata, // this will overwrite plan if it exists, but preserve fields like `role`
    //   };

    //   const shouldUpdate = clerk
    //     ? !isEqual(clerk.privateMetadata, mergedPrivateMetadata)
    //     : false;

    //   if (shouldUpdate) {
    //     try {
    //       await clerkAwait.users.updateUser(userId, {
    //         privateMetadata: mergedPrivateMetadata,
    //       });
    //       devLog.error("Clerk user privateMetadata updated");
    //     } catch (updateError) {
    //       devLog.error(
    //         "Failed to update Clerk user privateMetadata:",
    //         updateError
    //       );
    //     }
    //   } else {
    //     devLog.error("No privateMetadata update needed");
    //   }
    // }
    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    Sentry.captureException(error); //enable sentry
    devLog.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE() {
  try {
    // Get the current user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    (await clerkClient()).users.deleteUser(userId);

    const deletedUser = await userRepository.deleteByClerkId(userId);
    if (!deletedUser) {
      return NextResponse.json(
        {
          success: true,
          message: "No user found with that Clerk ID",
        },
        { status: 204 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "User account deleted.",
      },
      { status: 204 }
    );
  } catch (error) {
    // Sentry.captureException(error); uncomment to enable Sentry
    devLog.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
