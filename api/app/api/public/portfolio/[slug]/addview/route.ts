import Portfolio from "@/models/Portfolio";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";
import { portfolioAnalyticRepository } from "@/repositories/PortfolioAnalyticRepository";
import { authGuard } from "@/lib/authGuard";

interface Params {
  params: Promise<{ slug: string }>;
}
/**
 * @openapi
 * /api/public/portfolios/{slug}/addview:
 *   post:
 *     summary: Record a portfolio view
 *     description: Adds a view for a published and public portfolio by the authenticated user and returns the portfolio details.
 *     tags:
 *       - Public
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug of the portfolio to record a view for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portfolio view recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 portfolio:
 *                   type: object
 *                   description: The portfolio object with populated template
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
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { userId } = await authGuard({ requireAdmin: false });

    console.log("adding view:", userId);
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
    // Record the view
    await portfolioAnalyticRepository.addView(userId, portfolio._id.toString());

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in GET /api/portfolios/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
