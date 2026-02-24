import connectDB from "@/lib/database";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}
/**
 * @swagger
 * /api/user/portfolios/{id}/archive:
 *   patch:
 *     summary: Archive a user's portfolio
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
 *         description: ID of the portfolio to archive
 *     responses:
 *       200:
 *         description: Portfolio archived successfully
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
 *                   description: Updated portfolio object
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

    const portfolio = await portfolioRepository.updatePortfolio(userId, {
      id: id,
      status: "archived",
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    devLog.error("Error in PATCH /api/user/portfolios/[id]/archive:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
