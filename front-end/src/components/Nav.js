// React import
import React from "react";

// React Router components
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {

  // page redirect साठी hook
  const navigate = useNavigate();

  // localStorage मधून user data fetch
  const auth = localStorage.getItem("user");

  // JSON string → object convert
  const user = auth ? JSON.parse(auth) : null;

  // logout function
  const logout = () => {

    // localStorage clear करतो
    localStorage.clear();

    // login page वर redirect
    navigate("/login");

  }

  return(

    <div>

      <ul className="nav-ul">

        {
          user ?

          // जर user login असेल
          <>

            <li><Link to="/">Products</Link></li>

            <li><Link to="/add">Add Product</Link></li>

            {/* Navbar मध्ये user name show */}
            <li>{user.name}</li>

            {/* logout */}
            <li onClick={logout}>
              <Link to="/login">Logout</Link>
            </li>

          </>

          :

          // login नसल्यास
          <>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>

        }

      </ul>

    </div>

  )

}

export default Nav;