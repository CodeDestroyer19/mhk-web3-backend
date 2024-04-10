import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import cors from "cors";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginExpress from "@bugsnag/plugin-express";
import createStore from "./routes/create-store/index.js";

const { start, getPlugin } = Bugsnag;

start({
  apiKey: "3ac28c1be6c98c20df280f880974a29d",
  plugins: [BugsnagPluginExpress],
});

var middleware = getPlugin("express");

const app = express();

// Use Bugsnag middleware
app.use(cors());

app.use(middleware.requestHandler);

// Serve Swagger UI at /api-docs route
app.use("/api-docs", serve, (req, res, next) => {
  const swaggerSpec = swaggerSpecs(req);
  setup(swaggerSpec)(req, res, next);
});

// Redirect root path to /api-docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.get("/api/createStorefront", createStore);

app.use(middleware.errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
