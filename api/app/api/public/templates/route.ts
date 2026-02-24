import { templateRepository } from "@/repositories/TemplateRepository";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { FilterQuery } from "mongoose";
import { TemplateDocument } from "@/models/Template";
import { devLog } from "@/lib/utils";

/**
 * @openapi
 * /api/public/templates:
 *   get:
 *     summary: Fetch all templates with optional filters
 *     description: Returns a list of templates with pagination, status, search, premium, and tags filters. Requires admin authentication.
 *     tags:
 *       - Public
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of templates per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, draft, published, archived]
 *         description: Filter by template status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in template titles or content
 *       - in: query
 *         name: premium
 *         schema:
 *           type: boolean
 *         description: Filter by premium templates
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags (multiple tags allowed)
 *     responses:
 *       200:
 *         description: A list of templates matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to fetch templates"
 */

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB (if not already connected)
    await connectDB();

    // Get query params from request URL
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const premiumParam = searchParams.get("premium");
    const premium = premiumParam === null ? undefined : premiumParam === "true";
    const tags = searchParams.getAll("tags"); // multiple tags

    // Build filters object
    const filters: FilterQuery<TemplateDocument> = { page, limit };
    if (status && status !== "all") filters.status = status;
    if (search) filters.search = search;
    if (tags.length > 0) filters.tags = tags;
    if (premium !== undefined) filters.premium = premium;

    // Fetch all templates (you can extend this with filters later)
    const templates = await templateRepository.findAllWithFilters(filters);

    // Return the templates in a JSON success response
    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    // Log any unexpected server error
    devLog.error("❌ Error fetching templates:", error);

    // Return generic 500 error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch templates",
      },
      { status: 500 }
    );
  }
}
