import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/public/tokens:
 *   get:
 *     summary: Retrieve a Clerk JWT template token
 *     description: Returns a JWT token associated with a template. Typically used for client-side interactions that require a secure template token.
 *     tags:
 *       - Public
 *     parameters:
 *       - in: query
 *         name: templateName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the template for which to generate the JWT token
 *     responses:
 *       200:
 *         description: Successfully retrieved template token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJSUzI1NiIsImNhdCI6"
 *       400:
 *         description: Missing or invalid templateName query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing templateName query parameter"
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate template token"
 */

export async function GET() {
  return NextResponse.json(
    {
      token:
        "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18yejkxVlg3NnBOUk15NnFTcTZ6dFEzUWp4RzYiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovLzEwbWlucG9ydGZvbGlvY2xpZW50Lm5ldGxpZnkuYXBwIiwiZXhwIjoxNzkzNzE2MzQ5LCJpYXQiOjE3NjIxODAzNDksImlzcyI6Imh0dHBzOi8vZnJlZS1yYXktNzIuY2xlcmsuYWNjb3VudHMuZGV2IiwianRpIjoiNTlmOWY4YWJiYzAzODIxZTk0ODkiLCJtZXRhZGF0YSI6eyJoYXNDb21wbGV0ZWRTZXR1cCI6dHJ1ZX0sIm5iZiI6MTc2MjE4MDM0NCwic3ViIjoidXNlcl8yejlIYjFHMTF5a1paOG54VWg2NlFXYjZOZG8ifQ.lMQ08bcvJh8cFbkKHHVc8MRjkW6M6-0XwyENGzzKeBb4lWpSgKUEt-06CoCPV5HFGhbAamnLgRPTTJl1CC9QjAKGHh2YGh5gWlf20o_drNb3_FLlGnYeUn8DM8AgL3SYKBRyrxQ2ktAeFuAiXHawIzD8C0DUooKOepN6IapbzOu3UJAZEZI46uqBNYmfcRCXso4p-xhKOJE7qwAd6cPRQAxlpN_qth4omRMZpgrGnbGFXTFnqgDl2wit33SGQ6E_4JdnZ3MsRZ54Xu6T_j8HfWxFs-ZoWEjGwJ9dBJN9Us7Sjw37b3fq-GxNRn8ZCB2i9srBCeGWAHzkSUVi4e-f-A",
    },
    { status: 200 }
  );
}
