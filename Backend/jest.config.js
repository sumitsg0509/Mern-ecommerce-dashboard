/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  // All suites share one MongoDB database, so run them serially.
  maxWorkers: 1,
  clearMocks: true,
  testTimeout: 15000,
};
