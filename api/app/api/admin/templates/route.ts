import { templateRepository } from "@/repositories/TemplateRepository";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { z } from "zod";
import { authGuard } from "@/lib/authGuard";
import {
  TemplateCreateInput,
  templateSchema,
} from "@/lib/validations/template";
import { FilterQuery } from "mongoose";
import { TemplateDocument } from "@/models/Template";
import { devLog } from "@/lib/utils";

/**
 * @openapi
 * /api/admin/templates:
 *   get:
 *     summary: Get all templates with optional filters
 *     description: Returns all templates from the database. Only accessible by authenticated admins.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of templates per page (default 10)
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by template status (e.g., published, draft)
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search keyword for templates
 *         schema:
 *           type: string
 *       - name: premium
 *         in: query
 *         description: Filter templates by premium status (true or false)
 *         schema:
 *           type: boolean
 *       - name: tags
 *         in: query
 *         description: Filter templates by tags (multiple allowed)
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *     responses:
 *       200:
 *         description: Templates fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 templates:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *
 *   post:
 *     summary: Create a new template
 *     description: Creates a new template entry in the database. Requires admin authentication.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Template data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateCreateInput'
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 template:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Failed to create template
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *
 * components:
 *   schemas:
 *     TemplateCreateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         premium:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         thumbnail:
 *           type: string
 */
export async function GET(request: NextRequest) {
  try {
    // Run the auth guard to ensure the user is logged in and authorized
    const auth = await authGuard();

    // If auth fails (unauthenticated or not admin), return error response
    if (auth instanceof NextResponse) {
      return auth;
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
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Run authentication guard to check user role (admin required)
    const auth = await authGuard();

    // If user is not authenticated or not an admin, return the error response
    if (auth instanceof NextResponse) {
      return auth;
    }

    // Connect to MongoDB before performing DB actions
    await connectDB();

    // Extract JSON body from the request
    const body = await req.json();

    // Validate input using Zod schema
    const validatedData = templateSchema.safeParse(body);

    // If validation fails, return 400 with detailed errors
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "validation error",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Extract typed, validated data for creation
    const data: TemplateCreateInput = validatedData.data;

    // Create the new template in the database
    const template = await templateRepository.create(data);

    // Return 201 success response with the created template
    return NextResponse.json(
      {
        success: true,
        template,
        message: "Template created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Log any unexpected error
    devLog.error("❌ Error creating template:", error);

    // If the error is a Zod validation error (edge case)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Return generic 500 error
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
