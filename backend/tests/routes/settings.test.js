import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

describe("Settings routes", () => {
  test("GET /api/settings returns 401 without token", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(401);
  });

  test("POST /api/settings/templates returns 201 with admin token", async () => {
    const { token } = await getAuthToken({ role: "admin" });

    const res = await request(app)
      .post("/api/settings/templates")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Location",
        type: "location",
        fields: [{ key: "name", label: "Name", fieldType: "string" }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
