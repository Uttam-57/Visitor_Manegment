import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

describe("User routes", () => {
  test("GET /api/users returns 401 without token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  test("GET /api/users returns 403 for operator", async () => {
    const { token } = await getAuthToken({ role: "operator" });

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test("GET /api/users returns 200 for admin", async () => {
    const { token } = await getAuthToken({ role: "admin" });

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
