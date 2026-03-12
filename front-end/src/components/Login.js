// ================================
// REACT IMPORT
// ================================

import React, { useState, useEffect } from "react";

// React Router navigation hook
import { useNavigate } from "react-router-dom";


function Login(){

  // ================================
  // STATE VARIABLES
  // ================================

  // email store करण्यासाठी
  const [email,setEmail] = useState("");

  // password store करण्यासाठी
  const [password,setPassword] = useState("");

  // page redirect साठी
  const navigate = useNavigate();


  // ================================
  // AUTO REDIRECT IF USER ALREADY LOGIN
  // ================================

  useEffect(()=>{

    // localStorage मधून user check करतो
    const auth = localStorage.getItem("user");

    // जर user login असेल तर direct products page open
    if(auth){
      navigate("/");
    }

  },[]);


  // ================================
  // LOGIN FUNCTION
  // ================================

  const login = async () => {

    // basic validation
    if(!email || !password){

      alert("Please enter email and password");
      return;

    }

    try{

      // backend API call
      let result = await fetch("http://localhost:5000/login",{

        method:"POST",

        body:JSON.stringify({email,password}),

        headers:{
          "Content-Type":"application/json"
        }

      });

      result = await result.json();


      // ================================
      // LOGIN SUCCESS
      // ================================

      if(result.name){

        // user data localStorage मध्ये save
        localStorage.setItem("user",JSON.stringify(result));

        // products page redirect
        navigate("/");

      }else{

        alert("Invalid Email or Password");

      }

    }catch(error){

      console.log("Login Error:",error);
      alert("Server Error");

    }

  }


  // ================================
  // UI PART
  // ================================

  return(

    <div className="login">

      <h1>Login</h1>

      {/* EMAIL INPUT */}

      <input
      type="email"
      placeholder="Enter Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>


      {/* PASSWORD INPUT */}

      <input
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>


      {/* LOGIN BUTTON */}

      <button onClick={login}>Login</button>

    </div>

  )

}


// component export
export default Login;