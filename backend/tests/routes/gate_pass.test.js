import request from "supertest";
import app from "../../src/app.js";
import { getAuthToken } from "../helpers/auth.js";

const createDepartment = async (token) => {
  const res = await request(app)
    .post("/api/departments")
    .set("Authorization", `Bearer ${token}`)
    .send({ depName: "Security", depCode: "SEC" });

  return res.body.data;
};

const createEmployee = async (token, departmentId) => {
  const res = await request(app)
    .post("/api/employees")
    .set("Authorization", `Bearer ${token}`)
    .send({
      empId: "EMP-100",
      empName: { first: "Ravi", last: "Sharma" },
      emp_dep: departmentId,
    });

  return res.body.data;
};

describe("Gate pass routes", () => {
  test("GET /api/gate-passes returns 401 without token", async () => {
    const res = await request(app).get("/api/gate-passes");
    expect(res.status).toBe(401);
  });

  test("POST /api/gate-passes returns 201 with admin token", async () => {
    const { token, user } = await getAuthToken({ role: "admin" });
    const department = await createDepartment(token);
    const employee = await createEmployee(token, department._id);

    const res = await request(app)
      .post("/api/gate-passes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        passType: "singleday",
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + 3600 * 1000).toISOString(),
        createdBy: user._id,
        employee_id: employee._id,
        purpose: "Client Visit",
        visitors: [
          {
            name: "Visitor One",
            phone: "9999999999",
            email: "visitor@example.com",
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
