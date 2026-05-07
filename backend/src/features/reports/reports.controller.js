import * as reportsService from "./reports.service.js";

export const getDailyLogs = async (req, res, next) => {
  try {
    const data = await reportsService.getDailyLogs(req.query);
    res.status(200).json({ success: true, message: "Daily logs retrieved", data });
  } catch (error) {
    next(error);
  }
};

export const getTimesheetSummary = async (req, res, next) => {
  try {
    const data = await reportsService.getTimesheetSummary(req.query);
    res.status(200).json({ success: true, message: "Timesheet summary retrieved", data });
  } catch (error) {
    next(error);
  }
};

export const getProjectProgress = async (req, res, next) => {
  try {
    const data = await reportsService.getProjectProgress(req.query);
    res.status(200).json({ success: true, message: "Project progress retrieved", data });
  } catch (error) {
    next(error);
  }
};

export const getTaskStatus = async (req, res, next) => {
  try {
    const data = await reportsService.getTaskStatus(req.query);
    res.status(200).json({ success: true, message: "Task status retrieved", data });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const data = await reportsService.getAttendance(req.query);
    res.status(200).json({ success: true, message: "Attendance retrieved", data });
  } catch (error) {
    next(error);
  }
};

export const getMissingEntries = async (req, res, next) => {
  try {
    const data = await reportsService.getMissingEntries(req.query);
    res.status(200).json({ success: true, message: "Missing entries retrieved", data });
  } catch (error) {
    next(error);
  }
};
