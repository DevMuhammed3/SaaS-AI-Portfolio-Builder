import { templateRepository } from "@/repositories/TemplateRepository";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { FilterQuery } from "mongoose";
import { TemplateDocument } from "@/models/Template";
import { auth } from "@clerk/nextjs/server";
import { devLog } from "@/lib/utils";

/**
 * @swagger
 * /api/user/templates:
 *   get:
 *     summary: Retrieve a paginated list of templates with optional filters
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
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
 *           enum: [all, active, inactive, archived]
 *         description: Filter templates by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search templates by name or description
 *       - in: query
 *         name: premium
 *         schema:
 *           type: boolean
 *         description: Filter templates by premium flag
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter templates by tags
 *     responses:
 *       200:
 *         description: List of templates returned successfully
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [active, inactive, archived]
 *                       premium:
 *                         type: boolean
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
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
 *         description: Internal server error / failed to fetch templates
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
 *                   example: Failed to fetch templates
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://portfoliobuild.qzz.io",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );
}


export async function GET(request: NextRequest) {
  try {
    // Run the auth guard to ensure the user is logged in and authorized
    const { userId } = await auth();

    // If auth fails (unauthenticated or not admin), return error response
    if (!userId) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 401 }
      );
    }
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
    const filters: FilterQuery<TemplateDocument> = {};

    if (status && status !== "all") filters.status = status;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (tags.length > 0) filters.tags = tags;
    if (premium !== undefined) filters.premium = premium;

    const templates = await templateRepository.findAllWithFilters({
      filters,
      page,
      limit
    });

    // Return the templates in a JSON success response
    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error: any) {
    console.error("FETCH TEMPLATES ERROR");
    console.error(error);
    console.error(error?.stack);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
