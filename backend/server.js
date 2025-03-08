require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
// Sử dụng cổng từ Render (process.env.PORT) thay vì cố định 5000
const port = process.env.PORT;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Cho phép kết nối SSL mà không cần chứng chỉ đầy đủ
  },
});

app.use(cors({ origin: "https://project-cloudl2-frontend.onrender.com" }));
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

// Thêm sản phẩm
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