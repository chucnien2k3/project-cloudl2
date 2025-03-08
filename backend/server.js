require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(bodyParser.json());

// Lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await pool.query(
      "SELECT * FROM products WHERE name ILIKE $1",
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});

// Thêm sản phẩm (không cần upload file)
app.post("/api/products", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
});

app.listen(port, () => {
  console.log(`Server chạy trên port ${port}`);
});