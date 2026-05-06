import request from "supertest";
import app from "../../src/app.js";
import { seedUser } from "../helpers/auth.js";

describe("Auth routes", () => {
  test("POST /api/auth/login returns access token", async () => {
    const { password } = await seedUser({ userEmail: "admin@example.com", email: "admin@example.com" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ companyId: "COMP-001", userEmail: "admin@example.com", password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
  });

  test("GET /api/auth/sessions returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/sessions");
    expect(res.status).toBe(401);
  });

  test("GET /api/auth/sessions returns 200 with token", async () => {
    const { password } = await seedUser({ userEmail: "admin@example.com", email: "admin@example.com" });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ companyId: "COMP-001", userEmail: "admin@example.com", password });

    const token = login.body?.data?.accessToken;

    const res = await request(app)
      .get("/api/auth/sessions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
