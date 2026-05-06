import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

describe("Company routes", () => {
  test("GET /api/company returns 401 without token", async () => {
    const res = await request(app).get("/api/company");
    expect(res.status).toBe(401);
  });

  test("POST /api/company returns 201 with admin token", async () => {
    const { token } = await getAuthToken({ role: "admin" });

    const res = await request(app)
      .post("/api/company")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Acme Corporation",
        shortName: "ACME",
        host: "acme.local",
        email: "info@acme.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
