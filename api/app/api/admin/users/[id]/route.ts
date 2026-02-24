import { userRepository } from "@/repositories/UserRepository";
import connectDB from "@/lib/database";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/authGuard";
import * as Sentry from "@sentry/node";

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by Clerk ID
 *     description: Retrieves a specific user from the database by Clerk user ID. Only accessible to admin users.
 *     tags:
 *       - Admin
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Clerk user ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (not authenticated)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       404:
 *         description: User not found in the database
 *       500:
 *         description: Internal server error
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if the user is authenticated and has admin role
    const auth = await authGuard();
    if (auth instanceof NextResponse) {
      return auth; // early return on unauthorized or forbidden
    }

    // Connect to the database
    const { id } = await params;
    await connectDB();

    // Get the user from our database
    const user = await userRepository.findByClerkId(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
