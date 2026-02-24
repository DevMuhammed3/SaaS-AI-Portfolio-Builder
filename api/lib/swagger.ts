import { createSwaggerSpec } from "next-swagger-doc";
import swaggerJSDoc from "swagger-jsdoc";

/**
 * Generates Swagger documentation spec using `next-swagger-doc`
 * for use in `/api/docs` route or Swagger UI rendering.
 */
export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // Location of API route handlers
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Full-Stack AI Portfolio Builder API Documentation",
        version: "1.0.0",
        license: {
          name: "License EULA",
          url: "https://github.com/sylvaincodes/10minportfolioclient/blob/main/LICENSE.md",
        },
        contact: {
          name: "Sylvain Codes",
          email: "syvlaincodeur@gmail.com",
          url: "https://www.patreon.com/sylvaincodes",
        },
      },
      servers: [
        {
          url: "https://restapi10minportfolioclient.netlify.app",
          description: "Production Environment",
        },
        {
          url: "http://localhost:3001",
          description: "Local Development Server",
        },
      ],
      // components: {
      //   securitySchemes: {
      //     BearerAuth: {
      //       type: "http",
      //       scheme: "bearer",
      //       bearerFormat: "JWT",
      //     },
      //   },
      // },
      // security: [{ BearerAuth: [] }], // Apply security globally
    },
  });

  return spec;
};

/**
 * Alternative Swagger JSDoc spec generator.
 * Useful if you're using `swagger-ui-express` or integrating with other tools.
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Full-Stack AI Portfolio Builder API Documentation",
      version: "1.0.0",
      license: {
        name: "License EULA",
        url: "https://github.com/sylvaincodes/10minportfolioclient/blob/main/LICENSE.md",
      },
      contact: {
        name: "Sylvain Codes",
        email: "syvlaincodeur@gmail.com",
        url: "https://www.patreon.com/sylvaincodes",
      },
    },
    servers: [
      {
        url: "https://restapi10minportfolioclient.netlify.app",
        description: "Production Environment",
      },
      {
        url: "http://localhost:3001",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        clerkAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ clerkAuth: [] }],
  },
  apis: ["./app/api/**/*.ts"], // Globs all TS files under `app/api/` for JSDoc annotations
};

// Export the Swagger JSDoc spec for use with Swagger UI middleware (if needed)
export const swaggerSpec = swaggerJSDoc(options);
