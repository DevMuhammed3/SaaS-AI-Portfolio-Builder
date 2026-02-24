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
 * /api/user/portfolio/experience:
 *   post:
 *     summary: Generate realistic work experience data for a professional portfolio
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userProfile:
 *                 type: object
 *                 description: Basic user profile context used to guide AI generation
 *     responses:
 *       200:
 *         description: Successfully generated experience data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate experience data
 */

export async function POST(request: NextRequest) {
  try {
    await authGuard({ requireAdmin: false });
    const body = await request.json();
    const { userProfile } = body;

    const prompt = `Generate realistic work experience data for a professional portfolio.
    ${
      userProfile
        ? `User profile context: Name: ${userProfile.name}, Title: ${userProfile.title}, Bio: ${userProfile.bio}`
        : ""
    }

    Generate 2-3 work experiences that are realistic and relevant. Return a JSON array with this exact structure:
    [
      {
        "_id": "unique_id_1",
        "title": "Job Title",
        "company": "Company Name",
        "location": "City, State/Country",
        "startDate": "2021-05-01T00:00:00.000Z",
        "endDate": "2023-06-01T00:00:00.000Z",
        "isCurrent": false,
        "description": "Detailed job description with responsibilities and impact",
        "achievements": [
          "Specific achievement with metrics",
          "Another achievement with quantifiable results",
          "Third achievement showing impact"
        ],
        "technologies": ["React", "TypeScript", "Node.js", "MongoDB"]
      }
    ]

    Make sure:
    - Use realistic job titles and company names
    - Include specific, measurable achievements
    - Add relevant technologies for each role
    - Make dates chronologically consistent
    - One experience can have "isCurrent": true with "endDate": null
    - Descriptions should be 2-3 sentences
    - Each role should have 2-4 achievements
    - Technologies should be relevant to the role

    Return only valid JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // optimized for structured JSON
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content ?? "[]";

    // Parse the generated text as JSON
    const experienceData = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: experienceData,
    });
  } catch (error) {
    devLog.error("Error generating experience data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate experience data",
      },
      { status: 500 }
    );
  }
}
