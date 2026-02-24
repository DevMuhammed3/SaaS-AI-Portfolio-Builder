import Portfolio from "@/models/Portfolio";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * @openapi
 * /api/public/portfolios/{slug}:
 *   get:
 *     summary: Get a published portfolio by slug
 *     description: Fetches a portfolio by its slug if it is published and public. Includes the template data via population.
 *     tags:
 *       - Public
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug of the portfolio to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 portfolio:
 *                   type: object
 *                   description: Portfolio object including populated template data
 *       404:
 *         description: Portfolio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const portfolio = await Portfolio.findOne({
      slug,
      status: "published",
      "settings.isPublic": true,
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
