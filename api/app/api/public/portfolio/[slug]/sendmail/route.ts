import connectDB from "@/lib/database";
import { getMailService } from "@/lib/mail-service";
import { generateEmailTemplate } from "@/lib/utils";
import { contactFormSchema, contactFormInput } from "@/lib/validations/mail";
import Portfolio from "@/models/Portfolio";
import { contactRepository } from "@/repositories/ContactRepository";
import { NextRequest, NextResponse } from "next/server";
import { devLog } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}
/**
 * @openapi
 * /api/public/portfolios/{slug}/sendmail:
 *   post:
 *     summary: Submit a contact form for a portfolio
 *     description: Sends a message to the portfolio owner via email and records it in the database. Prevents duplicate submissions from the same email.
 *     tags:
 *       - Public
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Slug of the portfolio to contact
 *         schema:
 *           type: string
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               subject:
 *                 type: string
 *                 example: "Inquiry about your portfolio"
 *               message:
 *                 type: string
 *                 example: "Hi, I loved your work! I would like to collaborate."
 *     responses:
 *       200:
 *         description: Message sent successfully or duplicate message detected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contactId:
 *                   type: string
 *                   description: ID of the saved contact message (if new)
 *                 emailResult:
 *                   type: object
 *                   description: Result of the email send operation
 *       400:
 *         description: Validation error or invalid request format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *                   description: Field-level validation errors
 *       404:
 *         description: Portfolio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error or email service misconfiguration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

export async function POST(request: NextRequest, { params }: Params) {
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
    const { slug } = await params;

    const portfolio = await Portfolio.findOne({ slug, status: "published" });
    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found." },
        { status: 404 }
      );
    }

    // Check for duplicate
    const alreadySent = await contactRepository.existsForPortfolioEmail(
      portfolio._id.toString(),
      email
    );

    if (alreadySent) {
      return NextResponse.json(
        {
          message:
            "Thanks for reaching out! You've already submitted a message—please hang tight while I get back to you.",
        },
        { status: 200 }
      );
    }

    // Send email
    const mailService = getMailService();
    const result = await mailService.sendMail({
      to: portfolio.profile.email,
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

    // Save contact
    const saved = await contactRepository.saveContactMessage({
      portfolio: portfolio._id.toString(),
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message:
          "Thank you for reaching out! I'll get back to you within the next 10 minutes.",
        contactId: saved._id.toString(),
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
