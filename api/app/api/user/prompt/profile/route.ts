// If using paying service
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { devLog } from "@/lib/utils";
import { authGuard } from "@/lib/authGuard";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

/**
 * @swagger
 * /api/user/portfolio/profile:
 *   post:
 *     summary: Generate a realistic professional profile for a portfolio
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               industry:
 *                 type: string
 *                 description: The user's target industry
 *               role:
 *                 type: string
 *                 description: The user's target professional role
 *     responses:
 *       200:
 *         description: Successfully generated a professional profile
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate profile data
 */

export async function POST(request: NextRequest) {
  try {
    await authGuard({ requireAdmin: false });
    const body = await request.json();
    const { industry, role } = body;

    const prompt = `Generate realistic professional profile data for a portfolio.
    ${industry ? `Industry: ${industry}` : ""}
    ${role ? `Role: ${role}` : ""}

    Generate a professional profile with this exact JSON structure:
    {
      "name": "Full Name",
      "title": "Professional Title",
      "bio": "Professional bio (2-3 sentences about experience, skills, and passion)",
      "email": "professional.email@example.com",
      "phone": "+1 555-XXX-XXXX",
      "location": "City, State",
      "website": "https://personalwebsite.com",
      "profilePhoto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "socialMedia": [
        {
          "platform": "LinkedIn",
          "url": "https://linkedin.com/in/username"
        },
        {
          "platform": "GitHub",
          "url": "https://github.com/username"
        },
        {
          "platform": "Twitter",
          "url": "https://twitter.com/username"
        }
      ]
    }

    Make sure:
    - Name sounds professional and realistic
    - Title matches the industry/role if provided
    - Bio is engaging and highlights key strengths
    - Email uses a professional format
    - Phone number uses US format
    - Location is a real city
    - Website URL is realistic
    - Use a professional headshot from Unsplash
    - Include 2-3 relevant social media platforms
    - All URLs should be realistic but don't need to be real

    Return only valid JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" / "gpt-4.1" depending on your needs
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    // Parse the generated text as JSON
    const profileData = JSON.parse(text);

    devLog.warn("prompt", profileData);

    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    devLog.error("Error generating profile data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate profile data",
      },
      { status: 500 }
    );
  }
}
