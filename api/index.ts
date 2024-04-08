// index.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { json } from "body-parser";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

export default (
  req: VercelRequest,
  res: VercelResponse,
  next: NextFunction
) => {
  // Define Swagger options
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Backend API Documentation",
        version: "1.0.0",
        description: "Documentation for the backend API of your application",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
    },
    apis: ["./index.ts"], // Path to the main application file
  };

  // Initialize Swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);

  const expressReq = req as unknown as ExpressRequest;
  const expressRes = res as unknown as ExpressResponse;
  swaggerUi.setup(swaggerSpec)(expressReq, expressRes, () => {});

  // Routes
  /**
   * @swagger
   * /api/createStorefront:
   *   post:
   *     summary: Create a new storefront
   *     description: Create a new storefront with provided metadata.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               metadata:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     description: Name of the storefront.
   *                   description:
   *                     type: string
   *                     description: Description of the storefront.
   *     responses:
   *       200:
   *         description: Storefront created successfully.
   *       400:
   *         description: Bad request. Invalid or missing parameters.
   */
  if (req.method === "POST" && req.url === "/api/createStorefront") {
    // Example: Save the storefront data to a database
    console.log("Received request to create storefront:", req.body);
    res.status(200).json({ message: "Storefront created successfully" });
  } else {
    // End the response if no other routes match
    res.end();
  }
};
