const pool = require("../config/database");

// Retrieve all products
async function getAllProducts() {
  const query = `
        SELECT p.id, p.name, c.name AS category, p.price, p.stock 
        FROM Products p
        JOIN Categories c ON p.category_id = c.id
    `;
  const [rows] = await pool.query(query);
  return rows;
}

// Create a new product
async function createProduct(productData) {
  const { name, price, stock, categoryId } = productData;

  if (!name || price === undefined || stock === undefined || !categoryId) {
    throw new Error(
      "All fields (name, price, stock, categoryId) are required.",
    );
  }

  const query = `
        INSERT INTO Products (name, price, stock, category_id)
        VALUES (?, ?, ?, ?)
    `;

  const [result] = await pool.query(query, [name, price, stock, categoryId]);
  return { id: result.insertId, name, price, stock, categoryId };
}

// Update an existing product
async function updateProduct(id, productData) {
  const { price, stock } = productData;

  if (price === undefined || stock === undefined) {
    throw new Error("Price and stock are required to update a product.");
  }

  const query = `
        UPDATE Products 
        SET price = ?, stock = ?
        WHERE id = ?
    `;

  const [result] = await pool.query(query, [price, stock, id]);

  if (result.affectedRows === 0) {
    throw new Error("Product not found.");
  }

  return { message: "Product successfully updated." };
}

// Delete a product
async function deleteProduct(id) {
  const query = `DELETE FROM Products WHERE id = ?`;

  const [result] = await pool.query(query, [id]);

  if (result.affectedRows === 0) {
    throw new Error("Product not found.");
  }

  return { message: "Product successfully removed." };
}

// Generate Quarterly Sales Report
async function getQuarterlySales() {
  const query = `
        SELECT 
            p.name AS productName,
            SUM(s.quantity) AS unitsSold,
            SUM(s.quantity * p.price) AS quarterlyRevenue
        FROM Sales s
        JOIN Products p ON s.product_id = p.id
        WHERE s.sale_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 QUARTER)
        GROUP BY p.id;
    `;
  const [rows] = await pool.query(query);
  return rows;
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getQuarterlySales,
};
