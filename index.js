import express from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import cors from "cors";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginExpress from "@bugsnag/plugin-express";
import * as store from "./routes/StoreController/index.js";
import * as product from "./routes/ProductController/index.js";
import * as customer from "./routes/CustomerController/index.js";
import * as order from "./routes/OrderController/index.js";
import * as orderitem from "./routes/OrderItemController/index.js";
import * as category from "./routes/CategoryController/index.js";

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
app.post("/api/createStorefront/:userAddress", store.createStore);
app.put("/api/updateStorefront/:userAddress", store.updateStorefront);
app.get("/api/getStorefront/:userAddress", store.getStorefront);
app.delete("/api/deleteStorefront/:userAddress", store.deleteStorefront);

// Basic Product CRUD Operations
app.post("/api/createProduct/:storeId/:productId", product.createProduct);
app.get("/api/products/:storeId", product.getAllProducts);
app.get("/api/products/:storeId/:productId", product.getProduct);
app.put("/api/updateProduct/:storeId/:productId", product.updateProduct);
app.delete("/api/deleteProduct/:storeId/:productId", product.deleteProduct);

// Bsic Categories CRUD Operations
app.post("/api/addCategory/:storeId", category.addCategory);
app.put("/api/updateCategory/:storeId/:categoryId", category.updateCategory);
app.get("/api/getCategory/:storeId/:categoryId", category.getCategory);
app.get("/api/getAllCategories/:storeId", category.getAllCategories);
app.delete("/api/deleteCategory/:storeId/:categoryId", category.deleteCategory);

// Basic Customer CRUD Operations
app.post("/api/addCustomer/:storeId", customer.addCustomer);
app.put("/api/updateCustomer/:storeId/:customerId", customer.updateCustomer);
app.get("/api/getCustomer/:storeId/:customerId", customer.getCustomer);
app.get("/api/getAllCustomers/:storeId", customer.getAllCustomers);
app.delete("/api/deleteCustomer/:storeId/:customerId", customer.deleteCustomer);

// Basic Order CRUD Operations
app.post("/api/createOrder/:storeId", order.createOrder);
app.put("/api/updateOrder/:storeId/:orderId", order.updateOrder);
app.get("/api/getOrder/:storeId/:orderId", order.getOrder);
app.get("/api/getAllOrders/:storeId", order.getAllOrders);
app.delete("/api/deleteOrder/:storeId/:orderId", order.deleteOrder);

// Bsic OrderItems CRUD Operations
app.post("/api/addOrderItem/:storeId/:orderId", orderitem.addOrderItem);
app.put(
  "/api/updateOrderItem/:storeId/:orderItemId",
  orderitem.updateOrderItem
);
app.get("/api/getOrderItem/:storeId/:orderItemId", orderitem.getOrderItem);
app.get("/api/getOrderItems/:storeId/:orderId", orderitem.getOrderItem);
app.delete(
  "/api/deleteOrderItem/:storeId/:orderItemId",
  orderitem.getOrderItem
);

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
