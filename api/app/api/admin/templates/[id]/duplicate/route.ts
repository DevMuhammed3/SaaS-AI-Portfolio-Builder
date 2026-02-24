import { type NextRequest, NextResponse } from "next/server";
import { templateRepository } from "@/repositories/TemplateRepository";
import { idSchema } from "@/lib/validations/template";
import { authGuard } from "@/lib/authGuard";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * @openapi
 * /api/admin/templates/{id}/duplicate:
 *   post:
 *     summary: Duplicate a template
 *     description: Duplicates an existing template by creating a copy with a modified title and inactive status.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to duplicate
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Template duplicated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 template:
 *                   type: object
 *                   description: The duplicated template object
 *       400:
 *         description: Invalid template ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Original template not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       409:
 *         description: Duplicate key error (title already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
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
 *                 message:
 *                   type: string
 */

export async function POST(request: NextRequest, { params }: Params) {
  try {
    // Check if the user is authenticated and authorized
    const auth = await authGuard();
    if (auth instanceof NextResponse) {
      return auth;
    }

    // Extract template ID from route
    const { id } = await params;

    // Validate ID format using Zod and Mongoose ObjectId check
    const validated = idSchema.safeParse(id);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const templateId = validated.data;

    // Check if the original template exists
    const originalTemplate = await templateRepository.findById(templateId);
    if (!originalTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Duplicate the template using repository method
    const duplicatedTemplate = await templateRepository.duplicateTemplate(
      templateId
    );

    if (!duplicatedTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to duplicate template",
        },
        { status: 500 }
      );
    }

    // Return success response with duplicated template
    return NextResponse.json(
      {
        success: true,
        message: "Template duplicated successfully",
        template: duplicatedTemplate,
      },
      { status: 201 }
    );
  } catch (error) {
    devLog.error("Error duplicating template:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes("validation")) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            details: error.message,
          },
          { status: 400 }
        );
      }

      // Handle duplicate key errors (e.g., title already exists)
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("E11000")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "A template with this title already exists",
          },
          { status: 409 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while duplicating the template",
      },
      { status: 500 }
    );
  }
}
