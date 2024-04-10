const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const cors = require("cors");
const Bugsnag = require("@bugsnag/js");
const BugsnagPluginExpress = require("@bugsnag/plugin-express");
const { createStore } = require("./routes/create-store");

Bugsnag.start({
  apiKey: "3ac28c1be6c98c20df280f880974a29d",
  plugins: [BugsnagPluginExpress],
});

var middleware = Bugsnag.getPlugin("express");

const app = express();

// Use Bugsnag middleware
app.use(cors());

app.use(middleware.requestHandler);

// Serve Swagger UI at /api-docs route
app.use("/api-docs", swaggerUI.serve, (req, res, next) => {
  const swaggerSpec = swaggerSpecs(req);
  swaggerUI.setup(swaggerSpec)(req, res, next);
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
