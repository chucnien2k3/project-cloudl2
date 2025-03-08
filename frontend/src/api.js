import axios from "axios";

const API_URL = "https://project-cloudl2-backend.onrender.com/api/products"; // Sẽ thay bằng URL Render sau

export const getProducts = async (search) => {
  const res = await axios.get(`${API_URL}?search=${search}`);
  return res.data;
};

export const addProduct = async (product) => {
  const res = await axios.post(API_URL, {
    name: product.name,
    description: product.description,
    price: product.price,
  });
  return res.data;
};