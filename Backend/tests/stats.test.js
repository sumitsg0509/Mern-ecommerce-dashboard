const request = require("supertest");

const app = require("../src/app");
const Product = require("../src/models/Product");
const User = require("../src/models/User");
const { connect, clearDatabase, disconnect } = require("./helpers/db");
const { createUserWithToken } = require("./helpers/auth");

let authorization;

const authed = (req) => req.set("Authorization", authorization);

beforeAll(connect);

beforeEach(async () => {
  ({ authorization } = await createUserWithToken());
});

afterEach(clearDatabase);
afterAll(disconnect);

describe("GET /stats", () => {
  it("requires authentication", async () => {
    await request(app).get("/stats").expect(401);
  });

  it("returns zero totals when the database is empty", async () => {
    const res = await authed(request(app).get("/stats")).expect(200);

    expect(res.body).toEqual({
      totalProducts: 0,
      inventoryValue: 0,
      users: 1,
    });
  });

  it("returns product totals, inventory value and user count", async () => {
    await User.create({
      name: "Second User",
      email: "second@example.com",
      password: "Password123",
    });

    await Product.create([
      { name: "Phone", price: 1000.5, brand: "Brand A", category: "Mobile" },
      { name: "Laptop", price: 2000, brand: "Brand B", category: "Laptop" },
    ]);

    const res = await authed(request(app).get("/stats")).expect(200);

    expect(res.body).toEqual({
      totalProducts: 2,
      inventoryValue: 3000.5,
      users: 2,
    });
  });
});

describe("GET /users/count", () => {
  it("requires authentication", async () => {
    await request(app).get("/users/count").expect(401);
  });

  it("returns the number of users", async () => {
    await User.create({
      name: "Third User",
      email: "third@example.com",
      password: "Password123",
    });

    const res = await authed(request(app).get("/users/count")).expect(200);

    expect(res.body).toEqual({ count: 2 });
  });
});
