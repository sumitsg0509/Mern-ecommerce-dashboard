import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const Protected = () => {
  // Only show protected routes when both the token and user are present
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;
