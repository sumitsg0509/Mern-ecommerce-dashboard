const path = require("path");
const dotenv = require("dotenv");

// Load Backend/.env regardless of the process working directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requireEnv = (key, fallback) => {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: requireEnv("MONGO_URI", "mongodb://127.0.0.1:27017/ecomm"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
  CLIENT_ORIGINS: (process.env.CLIENT_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

module.exports = env;
