const request = require("supertest");

const app = require("../src/app");
const { connect, clearDatabase, disconnect } = require("./helpers/db");

beforeAll(connect);
afterEach(clearDatabase);
afterAll(disconnect);

describe("application routing and middleware", () => {
  it("exposes a health response at /", async () => {
    const res = await request(app).get("/").expect(200);

    expect(res.body).toEqual({ success: true, message: "API running" });
  });

  it("returns 404 (not 401) for an unknown route", async () => {
    const res = await request(app).get("/definitely-not-a-route").expect(404);

    expect(res.body).toEqual({
      success: false,
      message: "Route not found: GET /definitely-not-a-route",
    });
  });

  it("returns 400 for malformed JSON bodies", async () => {
    const res = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send('{"name": "Broken",')
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it("sets CORS headers for the configured client origin", async () => {
    const res = await request(app)
      .get("/")
      .set("Origin", "http://localhost:3000")
      .expect(200);

    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000"
    );
  });

  it("does not allow an unconfigured origin", async () => {
    const res = await request(app)
      .get("/")
      .set("Origin", "http://evil.example.com")
      .expect(200);

    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
