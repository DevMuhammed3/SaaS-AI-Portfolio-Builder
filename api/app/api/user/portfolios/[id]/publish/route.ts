import connectDB from "@/lib/database";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { userRepository } from "@/repositories/UserRepository";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}
/**
 * @swagger
 * /api/user/portfolios/{id}/publish:
 *   patch:
 *     summary: Update a user's portfolio status
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the portfolio to update
 *     requestBody:
 *       description: New status for the portfolio
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [published, draft, archived]
 *                 example: published
 *     responses:
 *       200:
 *         description: Portfolio status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 portfolio:
 *                   type: object
 *                   description: Updated portfolio object, or null if user on free plan limit reached
 *       400:
 *         description: Invalid status or user not found
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
 *                   example: Invalid or missing status value
 *                 portfolio:
 *                   type: object
 *                   nullable: true
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

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Connect to MongoDB before performing DB actions
    await connectDB();

    // Run the auth guard to ensure the user is logged in and authorized
    const { userId } = await auth();

    // If auth fails (unauthenticated or not admin), return error response
    if (!userId) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const { status } = await request.json();
    if (!status || !["published", "draft", "archived"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing status value" },
        { status: 400 }
      );
    }
    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const number = await portfolioRepository.countPublished(
      user._id.toString()
    );

    if (number > 0 && user.plan === "free") {
      return NextResponse.json(
        {
          message: "upgrade your plan to publish unlimited portfolio",
          success: true,
          portfolio: null,
        },
        { status: 200 }
      );
    }

    const portfolio = await portfolioRepository.updatePortfolio(
      user._id.toString(),
      {
        id: id,
        status: status,
      }
    );

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in PATCH /api/user/portfolios/[id]/publish:", error);
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 }
    );
  }
}
