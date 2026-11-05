const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");

// GET /products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// POST /add-product
const addProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// GET /product/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

// PUT /product/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json(product);
});

// DELETE /product/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await Product.findByIdAndDelete(req.params.id);

  if (!result) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, message: "Product deleted successfully", id: result._id });
});

// GET /search/:key
const searchProducts = asyncHandler(async (req, res) => {
  const key = escapeRegex(req.params.key);
  const regex = new RegExp(key, "i");

  const products = await Product.find({
    $or: [{ name: regex }, { brand: regex }, { category: regex }],
  }).sort({ createdAt: -1 });

  res.json(products);
});

module.exports = {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
