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
 * /api/user/portfolio/projects:
 *   post:
 *     summary: Generate realistic project data for a professional portfolio
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
 *                 description: Basic user context to guide AI project generation
 *                 properties:
 *                   name:
 *                     type: string
 *                   title:
 *                     type: string
 *                   bio:
 *                     type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of preferred technologies to include in generated projects
 *     responses:
 *       200:
 *         description: Successfully generated project data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate projects data
 */

export async function POST(request: NextRequest) {
  try {
    await authGuard({ requireAdmin: false });
    const body = await request.json();
    const { userProfile, technologies } = body;

    const prompt = `Generate realistic project data for a professional portfolio.
    ${
      userProfile
        ? `User context: Name: ${userProfile.name}, Title: ${userProfile.title}, Bio: ${userProfile.bio}`
        : ""
    }
    ${technologies ? `Preferred technologies: ${technologies.join(", ")}` : ""}

    Generate 3-4 projects that showcase different skills and technologies. Return a JSON array with this exact structure:
    [
      {
        "_id": "unique_id_1",
        "title": "Project Name",
        "description": "Detailed project description explaining what it does, key features, and impact",
        "thumbnail": "https://images.unsplash.com/photo-1559311648-d46f5d8593d6?w=400&h=300&fit=crop",
        "demoUrl": "https://projectname.com",
        "githubUrl": "https://github.com/username/projectname",
        "technologies": ["React", "TypeScript", "Tailwind CSS", "Firebase"],
        "isFeatured": true
      }
    ]

    Make sure:
    - Project names are creative but professional
    - Descriptions are 2-3 sentences explaining purpose and key features
    - Use relevant Unsplash images for thumbnails (tech/coding related)
    - Demo URLs should be realistic project names
    - GitHub URLs should follow proper format
    - Technologies should be relevant and modern
    - Mark 1-2 projects as featured (isFeatured: true)
    - Include a mix of web apps, tools, and platforms
    - Each project should have 3-6 technologies
    - Descriptions should highlight problem-solving and impact

    Return only valid JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // good for structured JSON
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content ?? "[]";

    devLog.warn(text);
    // Parse the generated text as JSON
    const projectsData = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: projectsData,
    });
  } catch (error) {
    devLog.error("Error generating projects data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate projects data",
      },
      { status: 500 }
    );
  }
}
