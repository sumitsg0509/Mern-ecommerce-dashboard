import React, { useState } from "react";

function AddProduct() {

  // form values store करण्यासाठी state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // Add Product function
  const addProduct = async () => {

    // API call to backend
    let result = await fetch("http://localhost:5000/add-product", {
      method: "POST",
      body: JSON.stringify({ name, price, brand, category }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    result = await result.json();

    if(result){
      alert("Product Added Successfully");
    }

  };

  return (
    <div className="add-product">
      <h1>Add Product</h1>

      {/* Product Name */}
      <input
        type="text"
        placeholder="Enter Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      {/* Product Price */}
      <input
        type="text"
        placeholder="Enter Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      {/* Product Brand */}
      <input
        type="text"
        placeholder="Enter Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <br /><br />

      {/* Product Category */}
      <input
        type="text"
        placeholder="Enter Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <br /><br />

      {/* Add Button */}
      <button onClick={addProduct}>Add Product</button>

    </div>
  );
}

export default AddProduct;