import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

/**
 * @openapi
 * /api/public/portfolios/validate-slug:
 *   get:
 *     summary: Validate if a portfolio slug is available
 *     description: Checks if a given slug is already used by another portfolio. Optionally exclude a specific portfolio by ID.
 *     tags:
 *       - Public
 *     parameters:
 *       - name: slug
 *         in: query
 *         required: true
 *         description: The slug to validate
 *         schema:
 *           type: string
 *           example: "my-portfolio"
 *       - name: excludeId
 *         in: query
 *         required: false
 *         description: Portfolio ID to exclude from validation (useful when updating a portfolio)
 *         schema:
 *           type: string
 *           example: "64f9d2c5e1b6a2a4d0f12345"
 *     responses:
 *       200:
 *         description: Slug validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   description: True if the slug is available
 *                 message:
 *                   type: string
 *                   description: Optional message regarding slug availability
 *       400:
 *         description: Missing required slug parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Slug parameter is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const validation = await portfolioRepository.validateSlugAvailability(
      slug,
      excludeId || undefined
    );
    return NextResponse.json(validation);
  } catch (error) {
    devLog.error("Error in GET /api/portfolios/validate-slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
