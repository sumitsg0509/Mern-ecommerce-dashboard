const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /stats  (protected) - dashboard totals, independent of search results
const getStats = asyncHandler(async (req, res) => {
  const [productStats, userCount] = await Promise.all([
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inventoryValue: { $sum: "$price" },
        },
      },
    ]),
    User.countDocuments(),
  ]);

  const totals = productStats[0] || { totalProducts: 0, inventoryValue: 0 };

  res.json({
    totalProducts: totals.totalProducts,
    inventoryValue: totals.inventoryValue,
    users: userCount,
  });
});

// GET /users/count (protected)
const getUserCount = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

module.exports = { getStats, getUserCount };
