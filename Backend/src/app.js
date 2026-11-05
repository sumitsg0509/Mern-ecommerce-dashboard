const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { apiLimiter } = require("./middleware/rateLimiters");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Security & parsing
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGINS,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Global rate limit (auth endpoints have a stricter limit in authRoutes)
app.use(apiLimiter);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

// Routes
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", statsRoutes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
