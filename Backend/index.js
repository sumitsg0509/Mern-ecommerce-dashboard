// =====================================
// IMPORT REQUIRED PACKAGES
// =====================================

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const cors = require("cors");

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

// frontend ला backend access allow करतो
app.use(cors());

// request body मधला JSON data read करतो
app.use(express.json());


// =====================================
// MONGODB CONNECTION
// =====================================

// MongoDB connection

mongoose.connect("mongodb://127.0.0.1:27017/ecomm");

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB Connection Error:", err);
});

// connection success
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

// connection error
mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB Connection Error:", err);
});


// =====================================
// TEST API
// =====================================

app.get("/", (req, res) => {
  res.send("🚀 API running successfully");
});


// =====================================
// USER REGISTER API
// =====================================

app.post("/register", async (req, res) => {

  try {

    // frontend कडून आलेला data वापरून new user create करतो
    let user = new User(req.body);

    // database मध्ये save करतो
    let result = await user.save();

    result = result.toObject();

    // security साठी password remove करतो
    delete result.password;

    // response send
    res.send(result);

  } catch (error) {

    console.log(error);
    res.status(500).send({ error: "User Registration Failed" });

  }

});


// =====================================
// USER LOGIN API
// =====================================

app.post("/login", async (req, res) => {

  try {

    if (req.body.email && req.body.password) {

      // database मध्ये user search
      let user = await User.findOne(req.body).select("-password");

      if (user) {

        res.send(user);

      } else {

        res.send({ result: "No User Found" });

      }

    } else {

      res.send({ result: "Email and Password Required" });

    }

  } catch (error) {

    console.log(error);
    res.status(500).send({ error: "Login Failed" });

  }

});


// =====================================
// GET ALL PRODUCTS
// =====================================

app.get("/products", async (req, res) => {

  try {

    // database मधले सर्व products fetch
    let products = await Product.find();

    res.send(products);

  } catch (error) {

    res.status(500).send({ error: "Unable to fetch products" });

  }

});


// =====================================
// ADD PRODUCT
// =====================================

app.post("/add-product", async (req, res) => {

  try {

    let product = new Product(req.body);

    let result = await product.save();

    res.send(result);

  } catch (error) {

    res.status(500).send({ error: "Product not added" });

  }

});


// =====================================
// GET SINGLE PRODUCT
// =====================================

app.get("/product/:id", async (req, res) => {

  try {

    let result = await Product.findById(req.params.id);

    res.send(result);

  } catch (error) {

    res.status(500).send({ error: "Product not found" });

  }

});


// =====================================
// DELETE PRODUCT
// =====================================

app.delete("/product/:id", async (req, res) => {

  try {

    let result = await Product.deleteOne({ _id: req.params.id });

    res.send(result);

  } catch (error) {

    res.status(500).send({ error: "Product delete failed" });

  }

});


// =====================================
// UPDATE PRODUCT
// =====================================

app.put("/product/:id", async (req, res) => {

  try {

    let result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    res.send(result);

  } catch (error) {

    res.status(500).send({ error: "Product update failed" });

  }

});


// =====================================
// SEARCH PRODUCT
// =====================================

app.get("/search/:key", async (req, res) => {

  try {

    let result = await Product.find({

      $or: [

        { name: { $regex: req.params.key, $options: "i" } },

        { brand: { $regex: req.params.key, $options: "i" } },

        { category: { $regex: req.params.key, $options: "i" } }

      ]

    });

    res.send(result);

  } catch (error) {

    res.status(500).send({ error: "Search failed" });

  }

});


// =====================================
// START SERVER
// =====================================

app.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});