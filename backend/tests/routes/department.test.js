import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

describe("Department routes", () => {
  test("GET /api/departments returns 401 without token", async () => {
    const res = await request(app).get("/api/departments");
    expect(res.status).toBe(401);
  });

  test("POST /api/departments returns 201 with admin token", async () => {
    const { token } = await getAuthToken({ role: "admin" });

    const res = await request(app)
      .post("/api/departments")
      .set("Authorization", `Bearer ${token}`)
      .send({ depName: "Security", depCode: "SEC" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
