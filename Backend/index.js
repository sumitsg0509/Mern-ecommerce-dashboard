const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
};

startServer();

// Fail loudly instead of leaving the process in a broken state
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});
