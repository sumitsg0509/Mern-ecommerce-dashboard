const express = require("express");
const {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { productSchema } = require("../validators/productValidator");

const router = express.Router();

// Auth is attached per route (not via router.use) so unmatched paths still
// fall through to the global 404 handler instead of returning 401.
router.get("/products", verifyToken, getProducts);
router.post("/add-product", verifyToken, validate(productSchema), addProduct);
router.get("/search/:key", verifyToken, searchProducts);
router.get("/product/:id", verifyToken, getProductById);
router.put("/product/:id", verifyToken, validate(productSchema), updateProduct);
router.delete("/product/:id", verifyToken, deleteProduct);

module.exports = router;
