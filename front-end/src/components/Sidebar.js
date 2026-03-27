// ==============================
// IMPORTS
// ==============================

import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {

  return (

    // ==============================
    // SIDEBAR CONTAINER
    // ==============================
    <div className="w-60 bg-gray-900 text-white min-h-screen p-5">

      {/* Logo */}
      <h2 className="text-2xl font-bold mb-6">E-Comm</h2>

      {/* ==============================
         MENU ITEMS
      ============================== */}
      <ul className="space-y-4">

        {/* PRODUCTS */}
        <li>
          <NavLink
            to="/"
            // active link styling
            className={({ isActive }) =>
              isActive
                ? "block bg-blue-500 p-2 rounded"
                : "block p-2 hover:bg-gray-700 rounded"
            }
          >
            📦 Products
          </NavLink>
        </li>

        {/* ADD PRODUCT */}
        <li>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              isActive
                ? "block bg-blue-500 p-2 rounded"
                : "block p-2 hover:bg-gray-700 rounded"
            }
          >
            ➕ Add Product
          </NavLink>
        </li>

        {/* PROFILE */}
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "block bg-blue-500 p-2 rounded"
                : "block p-2 hover:bg-gray-700 rounded"
            }
          >
            👤 Profile
          </NavLink>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;