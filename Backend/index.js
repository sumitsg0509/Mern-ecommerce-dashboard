// ================================
// IMPORT REQUIRED PACKAGES
// ================================
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());

// ================================
// JWT SECRET KEY
// ================================
const JWT_SECRET = "ecom-dashboard-secret-key";

// ================================
// MONGODB CONNECTION
// ================================
mongoose.connect("mongodb://127.0.0.1:27017/ecomm");

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

// ================================
// VERIFY TOKEN MIDDLEWARE
// ================================
const verifyToken = (req, res, next) => {

  try {

    let token = req.headers['authorization'];

    if (!token) {
      return res.status(403).send({ result: "Token Required" });
    }

    // format: Bearer TOKEN
    token = token.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, valid) => {

      if (err) {
        return res.status(401).send({ result: "Invalid Token" });
      } else {
        next();
      }

    });

  } catch (error) {
    return res.status(500).send({ result: "Token Error" });
  }
};

// ================================
// TEST API
// ================================
app.get("/", (req, res) => {
  res.send("API running");
});

// ================================
// USER REGISTER
// ================================
app.post("/register", async (req, res) => {

  try {
    let user = new User(req.body);
    let result = await user.save();

    result = result.toObject();
    delete result.password;

    res.send(result);

  } catch (error) {
    res.status(500).send({ result: "Error in Register" });
  }

});

// ================================
// USER LOGIN (JWT)
// ================================
app.post("/login", async (req, res) => {

  try {

    if (req.body.email && req.body.password) {

      let user = await User.findOne(req.body).select("-password");

      if (user) {

        jwt.sign(
          { user },
          JWT_SECRET,
          { expiresIn: "2h" },
          (err, token) => {

            if (err) {
              return res.send({ result: "Something went wrong" });
            }

            res.send({ user, auth: token });
          }
        );

      } else {
        res.send({ result: "No User Found" });
      }

    } else {
      res.send({ result: "No User Found" });
    }

  } catch (error) {
    res.status(500).send({ result: "Login Error" });
  }

});

// ================================
// PRODUCT APIs (PROTECTED)
// ================================

// GET ALL PRODUCTS
app.get("/products", verifyToken, async (req, res) => {

  try {
    let products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ result: "Error fetching products" });
  }

});

// ADD PRODUCT
app.post("/add-product", verifyToken, async (req, res) => {

  try {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({ result: "Error adding product" });
  }

});

// GET SINGLE PRODUCT
app.get("/product/:id", verifyToken, async (req, res) => {

  try {
    let result = await Product.findOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ result: "Error fetching product" });
  }

});

// DELETE PRODUCT
app.delete("/product/:id", verifyToken, async (req, res) => {

  try {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ result: "Error deleting product" });
  }

});

// UPDATE PRODUCT
app.put("/product/:id", verifyToken, async (req, res) => {

  try {
    let result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ result: "Error updating product" });
  }

});

// SEARCH PRODUCT
app.get("/search/:key", verifyToken, async (req, res) => {

  try {
    let result = await Product.find({
      "$or": [
        { name: { $regex: req.params.key, $options: "i" } },
        { brand: { $regex: req.params.key, $options: "i" } },
        { category: { $regex: req.params.key, $options: "i" } }
      ]
    });

    res.send(result);

  } catch (error) {
    res.status(500).send({ result: "Search Error" });
  }

});

// ================================
// START SERVER
// ================================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// =========================
// GET USERS
// =========================
app.get("/users", async (req, resp) => {
  try {
    const users = await User.find();
    resp.send(users);
  } catch (err) {
    resp.status(500).send({ error: "Failed to fetch users" });
  }
});