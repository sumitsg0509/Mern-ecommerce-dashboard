const request = require("supertest");

const app = require("../src/app");
const Product = require("../src/models/Product");
const { connect, clearDatabase, disconnect } = require("./helpers/db");
const { createUserWithToken } = require("./helpers/auth");

const validProduct = {
  name: "iPhone 15 Pro",
  price: 129999,
  brand: "Apple",
  category: "Mobile",
};

let authorization;

const api = () => request(app);
const authed = (req) => req.set("Authorization", authorization);

beforeAll(connect);

beforeEach(async () => {
  ({ authorization } = await createUserWithToken());
});

afterEach(clearDatabase);
afterAll(disconnect);

describe("authentication requirements", () => {
  const product = {
    id: "507f1f77bcf86cd799439011",
    body: validProduct,
  };

  it.each([
    ["GET", "/products"],
    ["POST", "/add-product"],
    ["GET", `/product/${product.id}`],
    ["PUT", `/product/${product.id}`],
    ["DELETE", `/product/${product.id}`],
    ["GET", "/search/iphone"],
  ])("returns 401 for %s %s without a token", async (method, url) => {
    const res = await api()[method.toLowerCase()](url).send(product.body);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });
});

describe("POST /add-product", () => {
  it("creates a product", async () => {
    const res = await authed(api().post("/add-product"))
      .send(validProduct)
      .expect(201);

    expect(res.body).toMatchObject(validProduct);
    expect(res.body._id).toBeDefined();
    expect(await Product.countDocuments()).toBe(1);
  });

  it("coerces a numeric string price and trims text fields", async () => {
    const res = await authed(api().post("/add-product"))
      .send({
        name: "  Galaxy S24  ",
        price: " 89999.5 ",
        brand: " Samsung ",
        category: " Mobile ",
      })
      .expect(201);

    expect(res.body).toMatchObject({
      name: "Galaxy S24",
      price: 89999.5,
      brand: "Samsung",
      category: "Mobile",
    });
  });

  it("strips unknown fields", async () => {
    const res = await authed(api().post("/add-product"))
      .send({ ...validProduct, owner: "attacker", _id: "507f1f77bcf86cd799439011" })
      .expect(201);

    expect(res.body.owner).toBeUndefined();
    expect(res.body._id).not.toBe("507f1f77bcf86cd799439011");
  });

  it.each([
    ["missing name", { name: undefined }, "Product name is required"],
    ["blank name", { name: "   " }, "Product name is required"],
    ["missing brand", { brand: undefined }, "Brand is required"],
    ["missing category", { category: undefined }, "Category is required"],
    ["negative price", { price: -1 }, "Price cannot be negative"],
    ["empty price", { price: "" }, "Price is required"],
    ["non-numeric price", { price: "abc" }, "Price must be a number"],
    ["null price", { price: null }, "Price is required"],
  ])("rejects %s with 400", async (_label, override, message) => {
    const res = await authed(api().post("/add-product"))
      .send({ ...validProduct, ...override })
      .expect(400);

    expect(res.body.message).toContain(message);
    expect(await Product.countDocuments()).toBe(0);
  });
});

describe("GET /products and /product/:id", () => {
  it("returns an empty list when there are no products", async () => {
    const res = await authed(api().get("/products")).expect(200);
    expect(res.body).toEqual([]);
  });

  it("returns all products", async () => {
    await Product.create(validProduct);
    await Product.create({ ...validProduct, name: "MacBook Pro", brand: "Apple" });

    const res = await authed(api().get("/products")).expect(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns a single product by id", async () => {
    const created = await Product.create(validProduct);

    const res = await authed(api().get(`/product/${created._id}`)).expect(200);
    expect(res.body.name).toBe(validProduct.name);
  });

  it("returns 400 for a malformed id", async () => {
    const res = await authed(api().get("/product/not-an-id")).expect(400);
    expect(res.body.message).toBe("Invalid resource id");
  });

  it("returns 404 for an unknown id", async () => {
    const res = await authed(
      api().get("/product/507f1f77bcf86cd799439011")
    ).expect(404);

    expect(res.body.message).toBe("Product not found");
  });
});

describe("PUT /product/:id", () => {
  it("updates a product", async () => {
    const created = await Product.create(validProduct);

    const res = await authed(api().put(`/product/${created._id}`))
      .send({ ...validProduct, name: "iPhone 16 Pro", price: 149999 })
      .expect(200);

    expect(res.body).toMatchObject({ name: "iPhone 16 Pro", price: 149999 });

    const stored = await Product.findById(created._id);
    expect(stored.name).toBe("iPhone 16 Pro");
  });

  it("returns 404 for an unknown product", async () => {
    const res = await authed(
      api().put("/product/507f1f77bcf86cd799439011")
    )
      .send(validProduct)
      .expect(404);

    expect(res.body.message).toBe("Product not found");
  });
});

describe("DELETE /product/:id", () => {
  it("deletes a product and then returns 404 for it", async () => {
    const created = await Product.create(validProduct);

    const res = await authed(api().delete(`/product/${created._id}`)).expect(
      200
    );

    expect(res.body).toMatchObject({
      success: true,
      message: "Product deleted successfully",
      id: created._id.toString(),
    });
    expect(await Product.countDocuments()).toBe(0);

    await authed(api().delete(`/product/${created._id}`)).expect(404);
  });

  it("returns 404 for an unknown product", async () => {
    const res = await authed(
      api().delete("/product/507f1f77bcf86cd799439011")
    ).expect(404);

    expect(res.body.message).toBe("Product not found");
  });
});

describe("GET /search/:key", () => {
  beforeEach(async () => {
    await Product.create([
      { name: "iPhone 15", price: 1000, brand: "Apple", category: "Mobile" },
      { name: "Galaxy S24", price: 900, brand: "Samsung", category: "Mobile" },
      { name: "MacBook Pro", price: 2000, brand: "Apple", category: "Laptop" },
      { name: "C++ Handbook", price: 50, brand: "O'Reilly", category: "Books" },
    ]);
  });

  it("matches by name case-insensitively", async () => {
    const res = await authed(api().get("/search/iphone")).expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("iPhone 15");
  });

  it("matches by brand", async () => {
    const res = await authed(api().get("/search/APPLE")).expect(200);
    expect(res.body).toHaveLength(2);
  });

  it("matches by category", async () => {
    const res = await authed(api().get("/search/mobile")).expect(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns an empty array when nothing matches", async () => {
    const res = await authed(api().get("/search/typewriter")).expect(200);
    expect(res.body).toEqual([]);
  });

  it("escapes regex special characters", async () => {
    const literal = await authed(
      api().get(`/search/${encodeURIComponent("C++")}`)
    ).expect(200);

    expect(literal.body).toHaveLength(1);
    expect(literal.body[0].name).toBe("C++ Handbook");

    const wildcard = await authed(
      api().get(`/search/${encodeURIComponent(".*")}`)
    ).expect(200);

    expect(wildcard.body).toEqual([]);
  });
});
