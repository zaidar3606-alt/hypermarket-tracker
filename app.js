const express = require("express");
const cors = require("cors");

// Import Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serves your Vanilla JS frontend

// Setup Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import your new routes
const productRoutes = require("./routes/productRoutes");

// Tell Express to use these routes for anything starting with /api/products
app.use("/api/products", productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
