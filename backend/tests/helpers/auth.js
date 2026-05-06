import request from "supertest";
import app from "../../src/app.js";
import User, { ROLE_DEFAULT_PERMISSIONS } from "../../src/features/user/user.model.js";

const baseUser = {
  employeeCode: "EMP-ADMIN-001",
  firstName: "Test",
  middleName: null,
  lastName: "Admin",
  phone: "+10000000000",
  email: "test.admin@example.com",
  userEmail: "admin@example.com",
  password: "Passw0rd!",
  designation: "Admin",
  department: null,
};

export const seedUser = async (overrides = {}) => {
  const payload = {
    ...baseUser,
    ...overrides,
  };

  const user = await User.create({
    ...payload,
    userRole: overrides.userRole || "admin",
    permissions: overrides.permissions || ROLE_DEFAULT_PERMISSIONS[overrides.userRole || "admin"],
  });

  return { user, password: payload.password };
};

export const loginUser = async ({ userEmail, password, companyId = "COMP-001" }) => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ companyId, userEmail, password });

  return res;
};

export const getAuthToken = async ({ role = "admin" } = {}) => {
  const email = role === "admin" ? "admin@example.com" : "operator@example.com";
  const { user, password } = await seedUser({
    userRole: role,
    userEmail: email,
    email,
    employeeCode: role === "admin" ? "EMP-ADMIN-001" : "EMP-OP-001",
  });

  const res = await loginUser({ userEmail: email, password });
  return { token: res.body?.data?.accessToken, user };
};
