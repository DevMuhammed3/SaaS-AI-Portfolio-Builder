import { authGuard } from "@/lib/authGuard";
// pages/api/user/portfolio-views.ts (or app/api/user/portfolio-views/route.ts in Next.js 13+)
import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { devLog } from "@/lib/utils";
import { portfolioAnalyticRepository } from "@/repositories/PortfolioAnalyticRepository";

/**
 * @swagger
 * /api/user/portfolio-views:
 *   get:
 *     summary: Get the authenticated user's portfolio views analytics
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Optional month to filter analytics
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Optional year to filter analytics
 *     responses:
 *       200:
 *         description: Portfolio analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Array of portfolio views grouped by day
 *                   items:
 *                     type: object
 *                     properties:
 *                       portfolioId:
 *                         type: string
 *                         example: 64f8e0d4a7c9f9001a2b3c4d
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-09-22"
 *                       views:
 *                         type: integer
 *                         example: 12
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
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Run auth guard
    const { userId } = await authGuard({ requireAdmin: false });

    // Optional: parse query params if needed (e.g., month/year)
    // const { searchParams } = new URL(request.url);
    // const month = parseInt(searchParams.get("month") || "", 10); // 1-12
    // const year = parseInt(searchParams.get("year") || "", 10); // full year

    // Fetch portfolio views grouped by day
    const data = await Promise.all([
      portfolioAnalyticRepository.getUserPortfolioAnalytics(userId),
    ]);

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    devLog.error("Error in GET /api/user/portfolio-views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
