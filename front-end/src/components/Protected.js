import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {

  // localStorage मधून user check करतो
  const auth = localStorage.getItem("user");

  // जर user logged in असेल तर children routes show कर
  // नाही तर login page ला redirect
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected;