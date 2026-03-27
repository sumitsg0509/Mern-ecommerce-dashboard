import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateProduct() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  // =========================
  // GET SINGLE PRODUCT (AUTO FILL)
  // =========================
  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();

    // 🔥 Auto fill form
    setName(result.name);
    setPrice(result.price);
    setBrand(result.brand);
    setCategory(result.category);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async () => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, brand, category }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();

    if (result) {
      alert("Product Updated");
      navigate("/");
    }
  };

  return (
    <div className="add-product">

      <h1>Update Product</h1>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
      <br /><br />

      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" />
      <br /><br />

      <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Enter Brand" />
      <br /><br />

      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter Category" />
      <br /><br />

      <button onClick={updateProduct}>Update Product</button>

    </div>
  );
}

export default UpdateProduct;