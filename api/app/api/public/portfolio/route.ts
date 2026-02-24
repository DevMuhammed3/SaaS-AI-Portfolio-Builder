import connectDB from "@/lib/database";
import { PortfolioDocument } from "@/models/Portfolio";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";
import { withCORSProtection } from "@/lib/cors"

/**
 * @openapi
 * /api/public/portfolio:
 *   get:
 *     summary: "Get public portfolios"
 *     description: "Fetches a list of publicly available portfolios with optional filters and pagination."
 *     tags:
 *       - Public
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: "Page number for pagination (default: 1)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: "Number of portfolios per page (default: 10)"
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: plan
 *         in: query
 *         required: false
 *         description: "Filter portfolios by plan type"
 *         schema:
 *           type: string
 *           example: "premium"
 *     responses:
 *       200:
 *         description: "List of public portfolios"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 portfolios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f9d2c5e1b6a2a4d0f12345"
 *                       name:
 *                         type: string
 *                         example: "John Doe Portfolio"
 *                       slug:
 *                         type: string
 *                         example: "john-doe-portfolio"
 *                       plan:
 *                         type: string
 *                         example: "free"
 *                       status:
 *                         type: string
 *                         example: "published"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-22T19:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-22T19:05:00.000Z"
 *       400:
 *         description: "Invalid request or filter parameters"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid page or limit parameter"
 *       500:
 *         description: "Internal server error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch public portfolios"
 */

export const GET = (req: NextRequest) =>
  withCORSProtection(req, async (request) => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);

      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const plan = searchParams.get("plan");

      const filters: FilterQuery<PortfolioDocument> = {
        page,
        limit,
        plan,
      };

      const portfolios =
        await portfolioRepository.getPublicPortfolios(filters);

      return NextResponse.json({
        success: true,
        portfolios,
      });
    } catch (error) {
      devLog.error("Error fetching public portfolios:", error);

      if (error instanceof Error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Failed to fetch public portfolios" },
        { status: 500 }
      );
    }
  });

export const OPTIONS = (req: NextRequest) =>
  withCORSProtection(req, async () => {
    return new NextResponse(null);
  });
