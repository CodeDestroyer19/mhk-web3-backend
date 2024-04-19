import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import cors from "cors";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginExpress from "@bugsnag/plugin-express";
import {
  createStore,
  deleteStorefront,
  getStorefront,
  updateStorefront,
} from "./routes/StoreController/index.js";

const { start, getPlugin } = Bugsnag;
const port = process.env.PORT || 3001;

start({
  apiKey: "3ac28c1be6c98c20df280f880974a29d",
  plugins: [BugsnagPluginExpress],
});

var middleware = getPlugin("express");

const app = express();

// Define custom middleware function to log requests
function logRequest(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Use Bugsnag middleware
app.use(cors());
app.use(middleware.requestHandler);
app.use(express.json());
// Use the custom logRequest middleware for all routes
app.use(logRequest);

// Serve Swagger UI at /api-docs route
app.use("/api-docs", serve, (req, res, next) => {
  const swaggerSpec = swaggerSpecs(req);
  setup(swaggerSpec)(req, res, next);
});

// Redirect root path to /api-docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Basic Store Crud Operations
app.post("/api/createStorefront/:userAddress", createStore);
app.put("/api/updateStorefront/:userAddress", updateStorefront);
app.get("/api/getStorefront/:userAddress", getStorefront);
app.delete("/api/deleteStorefront/:userAddress", deleteStorefront);

// Basic Product CRUD Operations

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
