import connectDB from "@/lib/database";
import { getMailService } from "@/lib/mail-service";
import { generateEmailTemplate } from "@/lib/utils";
import { contactFormSchema, contactFormInput } from "@/lib/validations/mail";
import { NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

/**
 * @openapi
 * /api/public/sendmail:
 *   post:
 *     summary: Send a contact form message
 *     description: Sends a contact form message to the configured email address.
 *     tags:
 *       - Public
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Name of the sender
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *                 description: Email address of the sender
 *               subject:
 *                 type: string
 *                 example: "Inquiry about services"
 *                 description: Subject of the message
 *               message:
 *                 type: string
 *                 example: "Hello, I would like to know more about your services."
 *                 description: The message content
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thank you for reaching out! I'll get back to you within the next 10 minutes."
 *                 emailResult:
 *                   type: object
 *                   description: Details returned by the email service
 *       400:
 *         description: Validation error or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Internal server error or email service misconfiguration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
export async function POST(request: NextRequest) {
  try {
    const requiredEnvVars = ["MAIL_USER", "MAIL_PASSWORD", "MAIL_HOST"];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
      return NextResponse.json(
        { message: "Email service is not configured properly." },
        { status: 500 }
      );
    }

    await connectDB();

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message }: contactFormInput = parsed.data;

    // Send email
    const mailService = getMailService();
    const result = await mailService.sendMail({
      to: process.env.MAIL_USER ?? "",
      subject: `📬 New Contact Message: ${subject}`,
      html: generateEmailTemplate({ name, email, subject, message }),
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json(
      {
        message:
          "Thank you for reaching out! I'll get back to you within the next 10 minutes.",
        emailResult: result,
      },
      { status: 200 }
    );
  } catch (error) {
    devLog.error("❌ Error handling contact form:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
