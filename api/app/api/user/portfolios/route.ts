import { devLog, generateSlug } from "@/lib/utils";
import connectDB from "@/lib/database";
import { PortfolioDocument } from "@/models/Portfolio";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { FilterQuery } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createPortfolioSchema,
  PortfolioInput,
} from "@/lib/validations/portfolio";
import { userRepository } from "@/repositories/UserRepository";

/**
 * @swagger
 * /api/user/portfolios:
 *   get:
 *     summary: Get all portfolios for the authenticated user
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived, all]
 *         description: Filter by portfolio status
 *       - in: query
 *         name: templateId
 *         schema:
 *           type: string
 *         description: Filter by template ID
 *     responses:
 *       200:
 *         description: A list of portfolios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 portfolios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Portfolio'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePortfolioRequest'
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Portfolio'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const templateId = searchParams.get("templateId");

    // Build filters object
    const filters: FilterQuery<PortfolioDocument> = { page, limit };
    if (status && status !== "all") filters.status = status;
    if (templateId) filters.templateId = search;

    const user = await userRepository.findByClerkId(userId);
    if (!user) {
      // handle not found
      throw new Error("User not found");
    }
    const portfolios = await portfolioRepository.findByUserId(
      user._id.toString(),
      filters
    );

    return NextResponse.json({
      success: true,
      portfolios,
    });
  } catch (error) {
    devLog.error("Error in GET /api/user/portfolios:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      // handle not found
      throw new Error("User not found");
    }
    // Validate input using Zod schema
    const slug = generateSlug(body.name);
    const validatedData = createPortfolioSchema.safeParse({
      ...body,
      slug: slug,
      userId: user._id.toString(),
    });

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
    const data: PortfolioInput = validatedData.data;

    devLog.error("Creating portfolio with data:", data);
    const portfolio = await portfolioRepository.createPortfolio(data);

    if (!portfolio) {
      return NextResponse.json(
        { error: "Failed to create portfolio" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, portfolio }, { status: 201 });
  } catch (error) {
    devLog.error("Error in POST /api/user/portfolios:", error);

    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 }
    );
  }
}
