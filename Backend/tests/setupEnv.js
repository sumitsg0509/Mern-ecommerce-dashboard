// Runs before every test file. Real environment variables (e.g. from CI)
// win, so the suite can be pointed at a service container if needed.
const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/ecomm_test";

process.env.NODE_ENV = "test";
process.env.MONGO_URI = process.env.MONGO_URI || TEST_MONGO_URI;
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret-do-not-use";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
