import express from "express";
import * as reportsController from "./reports.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import {
  dailyLogsSchema,
  timesheetSummarySchema,
  projectProgressSchema,
  taskStatusSchema,
  attendanceSchema,
  missingEntriesSchema,
} from "./reports.validation.js";
import { authenticate, requirePermission } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate, requirePermission("viewReports"));

router.get("/daily-logs", validateRequest(dailyLogsSchema), reportsController.getDailyLogs);
router.get("/timesheet-summary", validateRequest(timesheetSummarySchema), reportsController.getTimesheetSummary);
router.get("/project-progress", validateRequest(projectProgressSchema), reportsController.getProjectProgress);
router.get("/task-status", validateRequest(taskStatusSchema), reportsController.getTaskStatus);
router.get("/attendance", validateRequest(attendanceSchema), reportsController.getAttendance);
router.get("/missing-entries", validateRequest(missingEntriesSchema), reportsController.getMissingEntries);

export default router;
