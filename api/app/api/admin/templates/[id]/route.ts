import { type NextRequest, NextResponse } from "next/server";
import { templateRepository } from "@/repositories/TemplateRepository";
import { z } from "zod";
import { authGuard } from "@/lib/authGuard";
import {
  idSchema,
  TemplateUpdateInput,
  templateUpdateSchema,
} from "@/lib/validations/template";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * @openapi
 * /api/admin/templates/{id}:
 *   get:
 *     summary: Get a single template by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Template not found
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
 *
 *   put:
 *     summary: Update a template by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update in the template
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateUpdateInput'
 *     responses:
 *       200:
 *         description: Template updated successfully
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
 *       404:
 *         description: Template not found
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
 *         description: Failed to update template
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
 *   delete:
 *     summary: Delete a template by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the template to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid template ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       404:
 *         description: Template not found
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
 *         description: Failed to delete template
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
 *     TemplateUpdateInput:
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
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Check if the user is authenticated and authorized
    const auth = await authGuard();
    if (auth instanceof NextResponse) {
      return auth;
    }

    // Get template ID from route parameters
    const { id } = await params;

    // Fetch template by ID from the repository
    const template = await templateRepository.findById(id);

    // Return 404 if template doesn't exist
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Return template data on success
    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    // Log and return 500 error if something goes wrong
    devLog.error("Error fetching template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch template",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Ensure the user is authenticated and authorized
    const auth = await authGuard();
    if (auth instanceof NextResponse) return auth;

    // Extract the template ID from the route
    const { id } = await params;

    // Parse the JSON body
    const body = await req.json();

    // Validate body using partial Zod schema (fields are optional for updates)
    const validatedData = templateUpdateSchema.safeParse(body);

    // If validation fails, return 400 with field-level errors
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Extract validated update data
    const data: TemplateUpdateInput = validatedData.data;

    // Update the template in the repository
    const template = await templateRepository.update(id, data);

    // Return 404 if no template was found with the given ID
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Return success response with updated template
    return NextResponse.json({
      success: true,
      template,
      message: "Template updated successfully",
    });
  } catch (error) {
    // Log the error
    devLog.error("Error updating template:", error);

    // Handle Zod-specific validation error (shouldn't happen here due to safeParse)
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

    // Return generic server error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update template",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Run auth guard to ensure access
    const auth = await authGuard();
    if (auth instanceof NextResponse) return auth;

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

    // Perform deletion from repository
    const deleted = await templateRepository.delete(id);

    // If no template was deleted, return 404
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 }
      );
    }

    // Return success confirmation
    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    // Log and return 500 error on failure
    devLog.error("Error deleting template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete template",
      },
      { status: 500 }
    );
  }
}
