export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  GATE_PASS: "/gatepass",
  USERS: "/users",
  SETTINGS: "/settings",
  REPORTS: "/reports",
  CHANGE_PASSWORD: "/change-password",
  AUTH_LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const buildResetPasswordRoute = (token = ":token") =>
  `/auth/reset-password/${token}`;
