// ==============================
// CSS IMPORT
// ==============================

import './App.css';


// ==============================
// COMPONENT IMPORT
// ==============================

// Navbar (Login / Signup pages साठी)
import Nav from './components/Nav';

// Footer
import Footer from './components/Footer';

// Sidebar (Dashboard साठी)
import Sidebar from "./components/Sidebar";


// ==============================
// PAGES IMPORT
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
// REACT ROUTER
// ==============================

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (

    <div className="App">

      {/* =========================
         ROUTER START
      ========================= */}

      <BrowserRouter>

        {/* =========================
           NAVBAR (Top Menu)
        ========================= */}

        <Nav />


        {/* =========================
           MAIN LAYOUT
        ========================= */}

        <div className="app">

          {/* Sidebar (Dashboard Menu) */}
          <Sidebar />

          {/* Content Area */}
          <div className="content">


            {/* =========================
               ROUTES
            ========================= */}

            <Routes>


              {/* =========================
                 PROTECTED ROUTES
                 Login नसल्यास open होणार नाही
              ========================= */}

              <Route element={<Protected />}>

                {/* Product List */}
                <Route path="/" element={<ProductList />} />

                {/* Add Product */}
                <Route path="/add" element={<AddProduct />} />

                {/* Update Product */}
                <Route path="/update/:id" element={<UpdateProduct />} />

                {/* Profile Page */}
                <Route path="/profile" element={<Profile />} />

              </Route>


              {/* =========================
                 PUBLIC ROUTES
              ========================= */}

              {/* Register */}
              <Route path="/signup" element={<SignUp />} />

              {/* Login */}
              <Route path="/login" element={<Login />} />


            </Routes>

          </div>

        </div>


        {/* =========================
           FOOTER
        ========================= */}

        <Footer />

      </BrowserRouter>

    </div>

  );

}

export default App;