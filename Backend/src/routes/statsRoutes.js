const express = require("express");
const { getStats, getUserCount } = require("../controllers/statsController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", verifyToken, getStats);
router.get("/users/count", verifyToken, getUserCount);

module.exports = router;
