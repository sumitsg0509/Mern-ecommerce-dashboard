const User = require("../../src/models/User");
const { signToken } = require("../../src/utils/token");

let counter = 0;

const buildUser = (overrides = {}) => ({
  name: "Test User",
  email: `user${++counter}.${Date.now()}@example.com`,
  password: "Password123",
  ...overrides,
});

// Creates a user directly through the model (skips the HTTP auth endpoints)
// and returns the plain password plus a ready-to-use bearer token.
const createUserWithToken = async (overrides = {}) => {
  const data = buildUser(overrides);
  const user = await User.create(data);

  return {
    user,
    token: signToken(user),
    password: data.password,
    authorization: `Bearer ${signToken(user)}`,
  };
};

module.exports = { buildUser, createUserWithToken };
