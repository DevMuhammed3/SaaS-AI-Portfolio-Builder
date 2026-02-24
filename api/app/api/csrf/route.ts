/**
 * CSRF Token API Endpoint
 *
 * Provides CSRF tokens for client-side applications.
 * This endpoint generates and returns a new CSRF token that can be used
 * in subsequent requests for CSRF protection.
 */

import { NextResponse } from "next/server";
import { generateAndSetCSRFToken } from "@/lib/csrf";
import { devLog } from "@/lib/utils";

/**
 * @swagger
 * /api/csrf:
 * components:
 *   examples:
 *     CSRFUsageExample:
 *       summary: How to use CSRF tokens in your application
 *       description: |
 *         **Step 1: Get CSRF Token**
 *         ```javascript
 *         const response = await fetch('/api/csrf-token');
 *         const { token } = await response.json();
 *         ```
 *
 *         **Step 2: Include in subsequent requests**
 *         ```javascript
 *         // Option 1: Using headers
 *         fetch('/api/protected-endpoint', {
 *           method: 'POST',
 *           headers: {
 *             'Content-Type': 'application/json',
 *             'X-CSRF-Token': token
 *           },
 *           body: JSON.stringify(data)
 *         });
 *
 *         // Option 2: Using form data
 *         const formData = new FormData();
 *         formData.append('_csrf', token);
 *         formData.append('data', JSON.stringify(data));
 *         ```
 *
 *         **Step 3: Server-side validation**
 *         The server automatically validates the CSRF token from:
 *         - X-CSRF-Token header
 *         - _csrf form field
 *         - csrf-token cookie (double-submit pattern)
 *   securitySchemes:
 *     CSRFToken:
 *       type: apiKey
 *       in: header
 *       name: X-CSRF-Token
 *       description: |
 *         CSRF token obtained from /api/csrf-token endpoint.
 *         Include this token in all state-changing requests (POST, PUT, PATCH, DELETE).
 */

/**
 * @swagger
 * /api/csrf:
 *   post:
 *     summary: Example of CSRF-protected endpoint
 *     description: |
 *       This is an example of how other endpoints should document CSRF token requirements.
 *       All state-changing operations should require CSRF token validation.
 *     tags:
 *       - CSRF
 *     security:
 *       - CSRFToken: []
 *     parameters:
 *       - in: header
 *         name: X-CSRF-Token
 *         required: true
 *         schema:
 *           type: string
 *         description: CSRF token obtained from /api/csrf-token
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 example: "example data"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               _csrf:
 *                 type: string
 *                 description: CSRF token (alternative to header)
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123"
 *               data:
 *                 type: string
 *                 example: "example data"
 *     responses:
 *       '200':
 *         description: Success
 *       '403':
 *         description: CSRF token validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid CSRF token"
 */
export async function GET() {
  try {
    const { token, response } = generateAndSetCSRFToken();

    // Return the token in the response body for client-side use
    return NextResponse.json(
      {
        success: true,
        token,
        message: "CSRF token generated successfully",
      },
      {
        status: 200,
        headers: response.headers,
      }
    );
  } catch (error) {
    devLog.error("Error generating CSRF token:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate CSRF token",
      },
      { status: 500 }
    );
  }
}
