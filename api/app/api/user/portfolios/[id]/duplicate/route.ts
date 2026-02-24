import connectDB from "@/lib/database";
import { devLog } from "@/lib/utils";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { userRepository } from "@/repositories/UserRepository";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}
/**
 * @swagger
 * /api/user/portfolios/{id}/duplicate:
 *   patch:
 *     summary: Duplicate a user's portfolio
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
 *         description: ID of the portfolio to duplicate
 *     responses:
 *       200:
 *         description: Portfolio duplicated successfully
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
 *                   description: The newly duplicated portfolio object
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
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

    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const portfolio = await portfolioRepository.duplicatePortfolio(
      user._id.toString(),
      id
    );
    devLog.error(portfolio);
    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in PATCH /api/user/portfolios/[id]/archive:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
