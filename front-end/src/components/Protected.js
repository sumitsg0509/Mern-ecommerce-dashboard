// React import
import React from "react";

// React Router components import
import { Navigate, Outlet } from "react-router-dom";

function Protected() {

  // localStorage मधून user data check करतो
  // जर user login असेल तर localStorage मध्ये data असतो
  const auth = localStorage.getItem("user");

  // जर user login असेल तर protected routes allow करतो
  // नाहीतर login page वर redirect करतो
  return auth ? <Outlet /> : <Navigate to="/login" />

}

// component export करतो
export default Protected;