const mongoose = require("mongoose");

// Safety rail: never wipe a database that does not look like a test database.
const assertTestDatabase = () => {
  const uri = process.env.MONGO_URI || "";

  if (!/(^|[/_-])test([/_-]|$)/i.test(uri)) {
    throw new Error(
      `Refusing to run tests against a non-test database: ${uri}. ` +
        "Set MONGO_URI to a database whose name contains \"test\"."
    );
  }
};

const connect = async () => {
  assertTestDatabase();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
};

const clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections();

  await Promise.all(
    collections.map((collection) => collection.deleteMany({}))
  );
};

const disconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { connect, clearDatabase, disconnect };
