const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");
const User = require("../src/models/User");
const env = require("../src/config/env");
const { connect, clearDatabase, disconnect } = require("./helpers/db");

const validUser = {
  name: "Sumit Gaikwad",
  email: "sumit@example.com",
  password: "Secret123",
};

const register = (body) => request(app).post("/register").send(body);
const login = (body) => request(app).post("/login").send(body);

beforeAll(connect);
afterEach(clearDatabase);
afterAll(disconnect);

describe("POST /register", () => {
  it("creates a user and never exposes the password", async () => {
    const res = await register(validUser).expect(201);

    expect(res.body).toMatchObject({
      name: validUser.name,
      email: validUser.email,
    });
    expect(res.body.password).toBeUndefined();
    expect(res.body.__v).toBeUndefined();
    expect(res.body._id).toBeDefined();

    const stored = await User.findOne({ email: validUser.email }).select(
      "+password"
    );

    expect(stored).not.toBeNull();
    expect(stored.password).not.toBe(validUser.password);
    expect(await bcrypt.compare(validUser.password, stored.password)).toBe(
      true
    );
  });

  it("trims and lowercases the name and email", async () => {
    const res = await register({
      ...validUser,
      name: "  Sumit Gaikwad  ",
      email: "  SUMIT@Example.COM  ",
    }).expect(201);

    expect(res.body.name).toBe("Sumit Gaikwad");
    expect(res.body.email).toBe("sumit@example.com");
  });

  it("rejects a duplicate email case-insensitively with 409", async () => {
    await register(validUser).expect(201);

    const res = await register({
      ...validUser,
      email: "SUMIT@example.com",
    }).expect(409);

    expect(res.body).toEqual({
      success: false,
      message: "An account with this email already exists",
    });
  });

  it.each([
    ["short password", { password: "123" }, "Password must be at least 6 characters"],
    ["missing password", { password: undefined }, "Password is required"],
    ["invalid email", { email: "not-an-email" }, "Please provide a valid email"],
    ["missing email", { email: undefined }, "Email is required"],
    ["short name", { name: "A" }, "Name must be at least 2 characters"],
    ["missing name", { name: undefined }, "Name is required"],
  ])("rejects %s with 400", async (_label, override, expectedMessage) => {
    const res = await register({ ...validUser, ...override }).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain(expectedMessage);
  });

  it("strips unknown fields such as role", async () => {
    const res = await register({ ...validUser, role: "admin" }).expect(201);

    expect(res.body.role).toBeUndefined();

    const stored = await User.findOne({ email: validUser.email }).lean();
    expect(stored.role).toBeUndefined();
  });

  it("rejects NoSQL operator injection attempts", async () => {
    const res = await register({
      ...validUser,
      email: { $ne: null },
    }).expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe("POST /login", () => {
  beforeEach(async () => {
    await User.create(validUser);
  });

  it("returns a JWT and the safe user object", async () => {
    const res = await login({
      email: validUser.email,
      password: validUser.password,
    }).expect(200);

    expect(typeof res.body.auth).toBe("string");
    expect(res.body.auth.split(".")).toHaveLength(3);
    expect(res.body.user).toMatchObject({
      name: validUser.name,
      email: validUser.email,
    });
    expect(res.body.user.password).toBeUndefined();

    const payload = jwt.verify(res.body.auth, env.JWT_SECRET);
    expect(payload.id).toBe(res.body.user._id);
  });

  it("accepts a differently-cased email", async () => {
    await login({
      email: "SUMIT@EXAMPLE.COM",
      password: validUser.password,
    }).expect(200);
  });

  it("returns the same generic 401 for a wrong password and unknown email", async () => {
    const wrongPassword = await login({
      email: validUser.email,
      password: "WrongPassword",
    }).expect(401);

    const unknownEmail = await login({
      email: "nobody@example.com",
      password: validUser.password,
    }).expect(401);

    expect(wrongPassword.body.message).toBe("Invalid email or password");
    expect(unknownEmail.body.message).toBe("Invalid email or password");
  });

  it("rejects a missing password with 400", async () => {
    const res = await login({ email: validUser.email }).expect(400);
    expect(res.body.message).toContain("Password is required");
  });
});

describe("authentication middleware", () => {
  const stats = () => request(app).get("/stats");

  it("rejects a missing token", async () => {
    const res = await stats().expect(401);
    expect(res.body.message).toBe("Authentication required");
  });

  it("rejects a malformed authorization scheme", async () => {
    const res = await stats()
      .set("Authorization", "Token some-token")
      .expect(401);

    expect(res.body.message).toBe("Authentication required");
  });

  it("rejects an invalid token", async () => {
    const res = await stats()
      .set("Authorization", "Bearer not-a-real-token")
      .expect(401);

    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("rejects an expired token", async () => {
    const user = await User.create(validUser);
    const expired = jwt.sign({ id: user._id.toString() }, env.JWT_SECRET, {
      expiresIn: -10,
    });

    const res = await stats()
      .set("Authorization", `Bearer ${expired}`)
      .expect(401);

    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("rejects a valid token for a deleted user", async () => {
    const token = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString() },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await stats()
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    expect(res.body.message).toBe("User no longer exists");
  });
});
