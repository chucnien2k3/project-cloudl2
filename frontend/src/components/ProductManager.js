import React, { useState, useEffect, useCallback } from "react"; // Loại bỏ useRef
import { getProducts, addProduct } from "../api";
import "../ProductManager.css";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "", price: "" }); // Loại bỏ image
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts(search);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async () => {
    // Kiểm tra điều kiện bắt buộc
    if (!form.name.trim()) {
      setError("Tên sản phẩm không được để trống!");
      return;
    }
    if (!form.description.trim()) {
      setError("Mô tả không được để trống!");
      return;
    }
    if (!form.price || form.price <= 0) {
      setError("Giá phải là số lớn hơn 0!");
      return;
    }

    try {
      const response = await addProduct(form);
      setProducts((prevProducts) => [...prevProducts, response]);
      setForm({ name: "", description: "", price: "" }); // Reset form
      setError("");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <div className="container">
      <h2>Quản lý sản phẩm</h2>

      {error && <div className="error">{error}</div>}

      <div className="add-product-form">
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button onClick={handleAddProduct}>Thêm sản phẩm</button>
      </div>

      <div className="search-form">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchProducts}>Tìm kiếm</button>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>Tên sản phẩm: {product.name}</h3>
            <p>Mô tả sản phẩm: {product.description}</p>
            <p className="price">Giá: {product.price} $</p>
          </div>
        ))}
      </div>
    </div>
  );
}