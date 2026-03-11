// import required packages
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // allow frontend to access backend
app.use(express.json()); // read JSON data from request body

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ecomm");

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

// Test API
app.get("/", (req, res) => {
  res.send("API running");
});


// =============================
// GET ALL PRODUCTS
// =============================
app.get("/products", async (req, res) => {
  let products = await Product.find();
  res.send(products);
});


// =============================
// ADD PRODUCT
// =============================
app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});


// =============================
// GET SINGLE PRODUCT
// =============================
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  res.send(result);
});


// =============================
// DELETE PRODUCT
// =============================
app.delete("/product/:id", async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});


// =============================
// UPDATE PRODUCT
// =============================
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});


// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});