import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {

  // ==============================
  // STATE (Form Inputs)
  // ==============================
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // redirect साठी
  const navigate = useNavigate();

  // ==============================
  // ADD PRODUCT FUNCTION
  // ==============================
  const addProduct = async () => {

    // ==============================
    // VALIDATION
    // ==============================
    if (!name || !price || !brand || !category) {
      alert("Please fill all fields");
      return;
    }

    try {

      // ==============================
      // TOKEN GET (JWT)
      // ==============================
      const token = JSON.parse(localStorage.getItem("token"));

      // ==============================
      // API CALL
      // ==============================
      let result = await fetch("http://localhost:5000/add-product", {
        method: "POST",
        body: JSON.stringify({ name, price, brand, category }),
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`   // 🔥 IMPORTANT
        }
      });

      result = await result.json();

      console.log("Add Product Response:", result);

      // ==============================
      // SUCCESS
      // ==============================
      if (result) {
        alert("Product Added Successfully");

        // form reset
        setName("");
        setPrice("");
        setBrand("");
        setCategory("");

        // redirect to product list
        navigate("/");

        // 🔥 IMPORTANT (refresh data)
        window.location.reload();
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-product">

      <h1>Add Product</h1>

      {/* ==========================
         PRODUCT NAME
      ========================== */}
      <input
        type="text"
        placeholder="Enter Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      {/* ==========================
         PRODUCT PRICE
      ========================== */}
      <input
        type="text"
        placeholder="Enter Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      {/* ==========================
         PRODUCT BRAND
      ========================== */}
      <input
        type="text"
        placeholder="Enter Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <br /><br />

      {/* ==========================
         PRODUCT CATEGORY
      ========================== */}
      <input
        type="text"
        placeholder="Enter Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <br /><br />

      {/* ==========================
         ADD BUTTON
      ========================== */}
      <button onClick={addProduct}>Add Product</button>

    </div>
  );
}

export default AddProduct;