import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

const createDepartment = async (token) => {
  const res = await request(app)
    .post("/api/departments")
    .set("Authorization", `Bearer ${token}`)
    .send({ depName: "Operations", depCode: "OPS" });

  return res.body.data;
};

describe("Employee routes", () => {
  test("GET /api/employees returns 401 without token", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(401);
  });

  test("POST /api/employees returns 201 with admin token", async () => {
    const { token } = await getAuthToken({ role: "admin" });
    const department = await createDepartment(token);

    const res = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        empId: "EMP-001",
        empName: { first: "Asha", last: "Patel" },
        emp_dep: department._id,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
