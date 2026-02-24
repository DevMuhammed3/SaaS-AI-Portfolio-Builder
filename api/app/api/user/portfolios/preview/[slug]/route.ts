import connectDB from "@/lib/database";
import Portfolio from "@/models/Portfolio";
import { userRepository } from "@/repositories/UserRepository";
import { auth } from "@clerk/nextjs/server";
// import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}
/**
 * @swagger
 * /api/user/portfolios/preview/{slug}:
 *   get:
 *     summary: Get a portfolio by slug (authenticated)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the portfolio
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
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
 *                   description: The portfolio object including populated templateId
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
 *                   example: Internal server error
 *       404:
 *         description: Portfolio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Portfolio not found
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

export async function GET(request: NextRequest, { params }: Params) {
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

    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const { slug } = await params;

    const portfolio = await Portfolio.findOne({
      slug,
    }).populate("templateId");

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in GET /api/portfolios/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
