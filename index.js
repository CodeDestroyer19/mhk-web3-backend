"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(body_parser_1.default.json());
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Serve Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API Documentation
 *     description: Retrieve the Swagger-generated API documentation.
 *     responses:
 *       200:
 *         description: Swagger-generated API documentation.
 */
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});
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
app.post("/api/createStorefront", (req, res) => {
    // Handle the request to create a storefront
    // Example: Save the storefront data to a database
    console.log("Received request to create storefront:", req.body);
    res.status(200).json({ message: "Storefront created successfully" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
