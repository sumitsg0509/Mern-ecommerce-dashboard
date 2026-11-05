const rateLimit = require("express-rate-limit");

const message = {
  success: false,
  message: "Too many requests, please try again later",
};

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message,
});

// Stricter limit for login/register to slow down brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message,
});

module.exports = { apiLimiter, authLimiter };
