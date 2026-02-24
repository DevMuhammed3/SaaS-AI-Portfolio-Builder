import connectDB from "@/lib/database";
import { createPortfolioSchema } from "@/lib/validations/portfolio";
import { portfolioRepository } from "@/repositories/PortfolioRepository";
import { userRepository } from "@/repositories/UserRepository";
import { UpdatePortfolioRequest } from "@/types/portfolio";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}
/**
 * @swagger
 * /api/user/portfolios/{id}:
 *   get:
 *     summary: Get a specific portfolio for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the portfolio
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 portfolio:
 *                   type: object
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a portfolio for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the portfolio
 *     requestBody:
 *       description: Portfolio fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Portfolio
 *               description:
 *                 type: string
 *                 example: Portfolio description
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               level:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 example: draft
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 portfolio:
 *                   type: object
 *       400:
 *         description: Validation error or user not found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a portfolio for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the portfolio
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export async function GET(req: NextRequest, { params }: Params) {
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

    const { id } = await params;

    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const portfolio = await portfolioRepository.getPortfolioById(
      id,
      user._id.toString()
    );

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in GET /api/user/portfolios/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
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
    const { id } = await params;

    const body = await request.json();
    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const data = {
      ...body,
      userId: user._id.toString(),
    };
    const validatedData = createPortfolioSchema.safeParse(data);

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
    const portfolioData: UpdatePortfolioRequest = {
      id: id,
      ...validatedData.data,
    };
    const portfolio = await portfolioRepository.updatePortfolio(
      user._id.toString(),
      portfolioData
    );

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "error" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error) {
    devLog.error("Error in PUT /api/user/portfolios/[id]:", error);

    if (error instanceof Error && error.message.includes("slug")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
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
    const { id } = await params;

    const user = await userRepository.findByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await portfolioRepository.deletePortfolio(user._id.toString(), id);
    return NextResponse.json({ success: true });
  } catch (error) {
    devLog.error("Error in DELETE /api/user/portfolios/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
