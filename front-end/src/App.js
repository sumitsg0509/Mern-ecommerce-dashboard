// ==============================
// CSS IMPORT
// ==============================

import './App.css';


// ==============================
// COMPONENT IMPORTS
// ==============================

import Nav from './components/Nav';
import Footer from './components/Footer';
import Sidebar from "./components/Sidebar";


// ==============================
// PAGES IMPORTS
// ==============================

import SignUp from './components/SignUp';
import Login from './components/Login';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import Profile from './components/Profile';


// ==============================
// PROTECTED ROUTE
// ==============================

import Protected from './components/Protected';


// ==============================
// REACT ROUTER IMPORTS
// ==============================

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";


// ==============================
// MAIN APP COMPONENT
// ==============================

// ⚠️ IMPORTANT:
// useLocation directly App मध्ये use करू शकत नाही
// म्हणून आपण inner component बनवतो

function AppWrapper() {

  const location = useLocation();

  // ==============================
  // HIDE SIDEBAR ON LOGIN / SIGNUP
  // ==============================
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (

    
    <div className="App">

  

      {/* =========================
         NAVBAR (Top Menu)
      ========================= */}
      <Nav />

      {/* =========================
         MAIN LAYOUT
      ========================= */}
      <div className="app">

        {/* =========================
           SIDEBAR (ONLY IF LOGGED IN PAGES)
        ========================= */}
        {!hideSidebar && <Sidebar />}

        {/* =========================
           CONTENT AREA
        ========================= */}
        <div className="content">

          <Routes>

            {/* =========================
               PROTECTED ROUTES
            ========================= */}
            <Route element={<Protected />}>

              <Route path="/" element={<ProductList />} />
              <Route path="/add" element={<AddProduct />} />
              <Route path="/update/:id" element={<UpdateProduct />} />
              <Route path="/profile" element={<Profile />} />

            </Route>

            {/* =========================
               PUBLIC ROUTES
            ========================= */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

          </Routes>

        </div>

      </div>

      {/* =========================
         FOOTER
      ========================= */}
      <Footer />

    </div>
  );
}


// ==============================
// ROOT APP (Router Wrapper)
// ==============================

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;