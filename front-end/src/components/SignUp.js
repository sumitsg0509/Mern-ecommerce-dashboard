import React, { useState } from "react";

function SignUp() {

  // form fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup function
  const signUp = async () => {

    console.log(name, email, password);

    // API call to backend
    let result = await fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    result = await result.json();

    console.log(result);

    if(result){
      alert("User Registered Successfully");
    }

  }

  return (
    <div className="register">

      <h1>Register</h1>

      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={signUp}>Sign Up</button>

    </div>
  )
}

export default SignUp;