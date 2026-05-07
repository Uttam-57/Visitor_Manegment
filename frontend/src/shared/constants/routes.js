export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  GATE_PASS: "/gatepass",
  PROJECTS: "/projects",
  TASKS: "/tasks",
  ENTRIES: "/entries",
  USERS: "/users",
  SETTINGS: "/settings",
  REPORTS: "/reports",
  CHAT: "/chat",
  CHANGE_PASSWORD: "/change-password",
  AUTH_LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const buildResetPasswordRoute = (token = ":token") =>
  `/auth/reset-password/${token}`;
