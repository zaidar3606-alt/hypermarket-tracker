const express = require("express");
const router = express.Router();
const productLogic = require("../controllers/productLogic");

// GET /api/products/report/sales
router.get("/report/sales", async (req, res) => {
  try {
    const report = await productLogic.getQuarterlySales();
    res.status(200).json(report);
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await productLogic.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const newProduct = await productLogic.createProduct(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Validation/Database error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productLogic.updateProduct(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Update error:", error.message);
    if (error.message === "Product not found.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productLogic.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete error:", error.message);
    if (error.message === "Product not found.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
});

module.exports = router;
