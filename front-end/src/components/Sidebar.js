// React import
import React from "react";

// routing साठी
import { Link } from "react-router-dom";

function Sidebar(){

  return(

    <div className="sidebar">

      <h2 className="logo">E-Comm</h2>

      <ul>

        {/* Products Page */}
        <li>
          <Link to="/">Products</Link>
        </li>

        {/* Add Product */}
        <li>
          <Link to="/add">Add Product</Link>
        </li>

        {/* Profile */}
        <li>
          <Link to="/profile">Profile</Link>
        </li>

        {/* Logout */}
        <li>
          <Link to="/logout">Logout</Link>
        </li>

      </ul>

    </div>

  )

}

export default Sidebar;