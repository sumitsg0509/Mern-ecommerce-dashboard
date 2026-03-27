import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ==============================
  // LOGIN FUNCTION
  // ==============================
  const login = async () => {

    // validation
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // API call
    let result = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    result = await result.json();

    // success
    if (result.auth) {

      // token save
      localStorage.setItem("token", JSON.stringify(result.auth));

      // user save
      localStorage.setItem("user", JSON.stringify(result.user));

      // redirect
      navigate("/");

    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login">

      <h1>Login</h1>

      {/* email input */}
      <input
        type="text"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      {/* password input */}
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      {/* login button */}
      <button onClick={login}>Login</button>


      {/* ==========================
    SIGNUP LINK
========================== */}
<p>
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/signup")}
    style={{ color: "#5fa8c5", cursor: "pointer", fontWeight: "bold" }}
  >
    Sign Up
  </span>
</p>

    </div>
  );
}

export default Login;