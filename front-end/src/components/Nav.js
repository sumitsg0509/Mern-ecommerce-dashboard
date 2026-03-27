// ==============================
// IMPORTS
// ==============================

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Nav() {

  // ==============================
  // CHECK USER LOGIN STATUS
  // ==============================
  const auth = localStorage.getItem("user");

  // navigation hook
  const navigate = useNavigate();

  // ==============================
  // LOGOUT FUNCTION
  // ==============================
  const logout = () => {
    localStorage.clear();   // remove token + user
    navigate("/signup");    // redirect to signup page
  };

  return (

    // ==============================
    // NAVBAR UI
    // ==============================
    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">

      {/* Logo / Title */}
      <h1 className="text-xl font-bold">E-Comm Dashboard</h1>

      {/* ==============================
         IF USER LOGGED IN → SHOW MENU
      ============================== */}
      {auth ? (
        <ul className="flex gap-6 items-center">

          {/* Products */}
          <li>
            <Link to="/" className="hover:text-gray-200">
              Products
            </Link>
          </li>

          {/* Add Product */}
          <li>
            <Link to="/add" className="hover:text-gray-200">
              Add Product
            </Link>
          </li>

          {/* Profile */}
          <li>
            <Link to="/profile" className="hover:text-gray-200">
              Profile
            </Link>
          </li>

          {/* Logout Button */}
          <li>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </li>

        </ul>
      ) : (

        // ==============================
        // IF USER NOT LOGGED IN
        // ==============================
        <ul className="flex gap-6">

          <li>
            <Link to="/login">Login</Link>
          </li>

          <li>
            <Link to="/signup">Sign Up</Link>
          </li>

        </ul>
      )}

    </div>
  );
}

export default Nav;