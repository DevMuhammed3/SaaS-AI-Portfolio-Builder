import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { authGuard } from "@/lib/authGuard";
import { portfolioAnalyticRepository } from "@/repositories/PortfolioAnalyticRepository";
/**
 * @swagger
 * /api/user/portfolio-analytics:
 *   get:
 *     summary: Fetch analytics for one or more portfolios of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: portfolioIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of portfolio IDs to filter analytics
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date to filter analytics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date to filter analytics
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           default: monthly
 *         description: Interval for grouping analytics data
 *     responses:
 *       200:
 *         description: Successfully retrieved portfolio analytics
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       portfolioId:
 *                         type: string
 *                         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-09-01
 *                       views:
 *                         type: integer
 *                         example: 120
 *                       uniqueVisitors:
 *                         type: integer
 *                         example: 95
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

export async function GET(req: Request) {
  await connectDB();
  const { userId } = await authGuard({ requireAdmin: false });

  const url = new URL(req.url);
  const portfolioIds = url.searchParams.getAll("portfolioIds");
  const startDate = url.searchParams.get("startDate")
    ? new Date(url.searchParams.get("startDate")!)
    : undefined;
  const endDate = url.searchParams.get("endDate")
    ? new Date(url.searchParams.get("endDate")!)
    : undefined;
  const interval =
    (url.searchParams.get("interval") as
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly") || "monthly";

  const data = await portfolioAnalyticRepository.getPortfolioAnalytics({
    ownerUserId: userId,
    portfolioIds,
    startDate,
    endDate,
    interval,
  });

  return NextResponse.json({ success: true, data });
}
