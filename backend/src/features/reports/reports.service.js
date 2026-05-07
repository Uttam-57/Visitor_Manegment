import Entry from "../entry/entry.model.js";
import Task from "../task/task.model.js";
import Project from "../project/project.model.js";
import User from "../user/user.model.js";
import AppError from "../../utils/appError.js";
import { buildDateRangeFilter, normalizeDateOnly } from "../../utils/date.utils.js";

const resolveEmployeeIds = async ({ employeeId, departmentId } = {}) => {
  if (employeeId) return [employeeId];
  if (!departmentId) return null;

  const employees = await User.find({
    department: departmentId,
    isActive: true,
    userRole: { $ne: "admin" },
  }).select("_id");

  return employees.map((employee) => employee._id);
};

export const getDailyLogs = async ({
  from,
  to,
  employeeId,
  departmentId,
  projectId,
  taskId,
} = {}) => {
  const filter = buildDateRangeFilter("date", from, to);

  if (projectId) filter["timeline.project"] = projectId;
  if (taskId) filter["timeline.task"] = taskId;

  const employeeIds = await resolveEmployeeIds({ employeeId, departmentId });
  if (employeeIds) filter.employee = { $in: employeeIds };

  const entries = await Entry.find(filter)
    .populate("employee", "fullName employeeCode userEmail department")
    .populate("timeline.project", "name code")
    .populate("timeline.task", "title status")
    .sort({ date: -1, createdAt: -1 })
    .lean();

  return entries;
};

export const getTimesheetSummary = async ({
  from,
  to,
  employeeId,
  departmentId,
  projectId,
  taskId,
} = {}) => {
  const match = buildDateRangeFilter("date", from, to);

  if (projectId) match["timeline.project"] = projectId;
  if (taskId) match["timeline.task"] = taskId;

  const employeeIds = await resolveEmployeeIds({ employeeId, departmentId });
  if (employeeIds) match.employee = { $in: employeeIds };

  const summary = await Entry.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$employee",
        totalEntries: { $sum: 1 },
        totalWorkMinutes: { $sum: "$totalWorkMinutes" },
        totalBreakMinutes: { $sum: "$totalBreakMinutes" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $project: {
        _id: 0,
        employee: {
          _id: "$employee._id",
          fullName: "$employee.fullName",
          employeeCode: "$employee.employeeCode",
          userEmail: "$employee.userEmail",
        },
        totalEntries: 1,
        totalWorkMinutes: 1,
        totalBreakMinutes: 1,
      },
    },
    { $sort: { "employee.fullName": 1 } },
  ]);

  return summary;
};

export const getProjectProgress = async ({ from, to, projectId }) => {
  const project = await Project.findById(projectId).select("name code status");
  if (!project) throw new AppError("Project not found", 404);

  const taskCounts = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: "$status", total: { $sum: 1 } } },
  ]);

  const dateMatch = buildDateRangeFilter("date", from, to);

  const workMinutes = await Entry.aggregate([
    { $match: dateMatch },
    { $unwind: "$timeline" },
    {
      $match: {
        "timeline.type": "work",
        "timeline.project": project._id,
      },
    },
    {
      $group: {
        _id: "$timeline.project",
        totalMinutes: { $sum: "$timeline.durationMinutes" },
      },
    },
  ]);

  return {
    project,
    taskCounts,
    totalWorkMinutes: workMinutes[0]?.totalMinutes || 0,
  };
};

export const getTaskStatus = async ({
  from,
  to,
  projectId,
  departmentId,
  assigneeId,
  status,
} = {}) => {
  const filter = {};

  if (projectId) filter.project = projectId;
  if (status) filter.status = status;
  if (assigneeId) filter.assignee = assigneeId;

  if (departmentId) {
    const employees = await User.find({
      department: departmentId,
      isActive: true,
      userRole: { $ne: "admin" },
    }).select("_id");
    filter.assignee = { $in: employees.map((employee) => employee._id) };
  }

  if (from || to) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = fromDate;
    if (toDate) filter.createdAt.$lte = toDate;
  }

  const tasks = await Task.find(filter)
    .populate("project", "name code status")
    .populate("assignee", "fullName userEmail")
    .sort({ createdAt: -1 })
    .lean();

  return tasks;
};

export const getAttendance = async ({ from, to, employeeId, departmentId } = {}) => {
  const filter = buildDateRangeFilter("date", from, to);

  const employeeIds = await resolveEmployeeIds({ employeeId, departmentId });
  if (employeeIds) filter.employee = { $in: employeeIds };

  const entries = await Entry.find(filter)
    .populate("employee", "fullName employeeCode userEmail department")
    .select("date employee checkInTime checkOutTime totalWorkMinutes totalBreakMinutes status")
    .sort({ date: -1 })
    .lean();

  return entries;
};

export const getMissingEntries = async ({ date, departmentId } = {}) => {
  const targetDate = normalizeDateOnly(date || new Date());
  if (!targetDate) throw new AppError("Invalid date", 400);

  const employeeFilter = {
    isActive: true,
    userRole: { $ne: "admin" },
  };

  if (departmentId) employeeFilter.department = departmentId;

  const employees = await User.find(employeeFilter).select("_id fullName employeeCode userEmail department");
  const employeeIds = employees.map((employee) => employee._id);

  const entries = await Entry.find({ date: targetDate, employee: { $in: employeeIds } }).select("employee");
  const withEntries = new Set(entries.map((entry) => String(entry.employee)));

  return employees.filter((employee) => !withEntries.has(String(employee._id)));
};
