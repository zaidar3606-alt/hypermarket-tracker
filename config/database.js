const mysql = require("mysql2/promise");

// Create a connection pool to the database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "zaid12345",
  database: "hypermarket_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection immediately
pool
  .getConnection()
  .then((connection) => {
    console.log("Successfully connected to MySQL database!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

module.exports = pool;
