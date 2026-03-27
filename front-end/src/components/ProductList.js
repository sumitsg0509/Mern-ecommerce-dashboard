import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    getProducts();
    getUsers(); //  call users
  }, []);

  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch("http://localhost:5000/products", {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();

    setProducts(result);

    // 🔥 Calculate revenue
    const total = result.reduce((sum, item) => sum + Number(item.price), 0);
    setTotalRevenue(total);
  };

  // =========================
  // GET USERS COUNT
  // =========================
  const getUsers = async () => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch("http://localhost:5000/users", {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();
    setUserCount(result.length);
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();

    if (result) {
      alert("Product Deleted");
      getProducts();
    }
  };

  // =========================
  // SEARCH WITH DEBOUNCE
  // =========================
  useEffect(() => {

    const delay = setTimeout(() => {

      if (search) {
        searchProducts(search);
      } else {
        getProducts();
      }

    }, 500);

    return () => clearTimeout(delay);

  }, [search]);

  const searchProducts = async (key) => {

    const token = JSON.parse(localStorage.getItem("token"));

    let result = await fetch(`http://localhost:5000/search/${key}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    result = await result.json();
    setProducts(result);
  };

  return (

    <div className="p-4">

      {/* =========================
         DASHBOARD CARDS
      ========================= */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Total Products</h2>
          <h1 className="text-2xl font-bold">{products.length}</h1>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Revenue</h2>
          <h1 className="text-2xl font-bold">₹ {totalRevenue}</h1>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500">Users</h2>
          <h1 className="text-2xl font-bold">{userCount}</h1>
        </div>

      </div>

      <h2 className="text-xl font-semibold mb-2">Product List</h2>

      {/* =========================
         SEARCH INPUT
      ========================= */}
      <input
        type="text"
        placeholder="🔍 Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* =========================
         PRODUCT TABLE
      ========================= */}
      <table className="w-full bg-white shadow rounded overflow-hidden">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">S.No</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Delete</th>
            <th className="p-2">Update</th>
          </tr>
        </thead>

        <tbody>

          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={item._id} className="border-t">

                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.brand}</td>

                <td className="p-2">
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>

                <td className="p-2">
                  <Link
                    to={"/update/" + item._id}
                    className="text-blue-500 hover:underline"
                  >
                    Update
                  </Link>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No Products Found
              </td>
            </tr>
          )}

        </tbody>
      </table>

    </div>
  );
}

export default ProductList;