export const apiEndpoints = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
    SESSIONS: "/auth/sessions",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    ACTIVATE: (id) => `/users/${id}/activate`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
    BY_ID: (id) => `/users/${id}`,
  },
  EMPLOYEES: {
    BASE: "/employees",
    BY_ID: (id) => `/employees/${id}`,
  },
  DEPARTMENTS: {
    BASE: "/departments",
    BY_ID: (id) => `/departments/${id}`,
  },
  COMPANY: {
    BASE: "/company",
    BY_ID: (id) => `/company/${id}`,
  },
  SETTINGS: {
    BASE: "/settings",
    TEMPLATES: "/settings/templates",
    TEMPLATE_BY_ID: (id) => `/settings/templates/${id}`,
    SETTING_BY_ID: (id) => `/settings/${id}`,
  },
  GATE_PASSES: {
    BASE: "/gate-passes",
    BY_ID: (id) => `/gate-passes/${id}`,
    STATUS: (id) => `/gate-passes/${id}/status`,
  },
  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id) => `/projects/${id}`,
  },
  TASKS: {
    BASE: "/tasks",
    BY_ID: (id) => `/tasks/${id}`,
  },
  ENTRIES: {
    BASE: "/entries",
    BY_ID: (id) => `/entries/${id}`,
    STATUS: (id) => `/entries/${id}/status`,
  },
  REPORTS: {
    DAILY_LOGS: "/reports/daily-logs",
    TIMESHEET_SUMMARY: "/reports/timesheet-summary",
    PROJECT_PROGRESS: "/reports/project-progress",
    TASK_STATUS: "/reports/task-status",
    ATTENDANCE: "/reports/attendance",
    MISSING_ENTRIES: "/reports/missing-entries",
  },
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    MESSAGES: (id) => `/chat/conversations/${id}/messages`,
  },
};
