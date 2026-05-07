import Entry from "./entry.model.js";
import User from "../user/user.model.js";
import Project from "../project/project.model.js";
import Task from "../task/task.model.js";
import AppError from "../../utils/appError.js";
import { normalizeDateOnly, endOfDay, diffDays, isSameDay } from "../../utils/date.utils.js";

const ADMIN_BACKFILL_DAYS = 7;
const EMPLOYEE_EDIT_WINDOW_MINUTES = 30;

const parseDateOrThrow = (value, label = "date") => {
  const normalized = normalizeDateOnly(value);
  if (!normalized) {
    throw new AppError(`Invalid ${label}`, 400);
  }
  return normalized;
};

const assertEntryDateAllowed = (entryDate, role) => {
  const today = normalizeDateOnly(new Date());
  if (!today) return;

  if (entryDate.getTime() > today.getTime()) {
    throw new AppError("Future entries are not allowed", 400);
  }

  const daysBack = diffDays(today, entryDate);
  if (role === "admin") {
    if (daysBack !== null && daysBack > ADMIN_BACKFILL_DAYS) {
      throw new AppError("Entry date is outside the admin backfill window", 400);
    }
  } else {
    if (daysBack !== 0) {
      throw new AppError("Only today's entry is allowed", 400);
    }
  }
};

const validateTimeline = (timeline, entryDate) => {
  if (!Array.isArray(timeline) || timeline.length === 0) {
    throw new AppError("Timeline is required", 400);
  }

  const dayStart = parseDateOrThrow(entryDate);
  const dayEnd = endOfDay(dayStart);

  const blocks = timeline.map((block) => {
    const startTime = new Date(block.startTime);
    const endTime = new Date(block.endTime);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      throw new AppError("Invalid timeline time values", 400);
    }

    return {
      ...block,
      startTime,
      endTime,
    };
  });

  blocks.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  let totalWorkMinutes = 0;
  let totalBreakMinutes = 0;

  blocks.forEach((block, index) => {
    if (block.endTime.getTime() <= block.startTime.getTime()) {
      throw new AppError("Timeline block must have positive duration", 400);
    }

    if (block.startTime.getTime() < dayStart.getTime() || block.endTime.getTime() > dayEnd.getTime()) {
      throw new AppError("Timeline blocks must be within the entry date", 400);
    }

    if (index > 0) {
      const previous = blocks[index - 1];
      if (block.startTime.getTime() !== previous.endTime.getTime()) {
        throw new AppError("Timeline must be continuous with no gaps", 400);
      }
    }

    if (block.type === "work" && !block.project) {
      throw new AppError("Work blocks must include a project", 400);
    }

    if (block.type === "break" && (block.project || block.task)) {
      throw new AppError("Break blocks cannot include project or task", 400);
    }

    const durationMinutes = Math.round((block.endTime.getTime() - block.startTime.getTime()) / 60000);
    block.durationMinutes = durationMinutes;

    if (block.type === "work") {
      totalWorkMinutes += durationMinutes;
    } else {
      totalBreakMinutes += durationMinutes;
    }
  });

  if (blocks[0].type !== "work" || blocks[blocks.length - 1].type !== "work") {
    throw new AppError("Timeline must start and end with work blocks", 400);
  }

  return {
    timeline: blocks,
    totalWorkMinutes,
    totalBreakMinutes,
    checkInTime: blocks[0].startTime,
    checkOutTime: blocks[blocks.length - 1].endTime,
  };
};

const ensureTimelineReferences = async (timeline) => {
  const projectIds = new Set();
  const taskIds = new Set();

  timeline.forEach((block) => {
    if (block.type === "work" && block.project) {
      projectIds.add(String(block.project));
    }
    if (block.type === "work" && block.task) {
      taskIds.add(String(block.task));
    }
  });

  if (projectIds.size) {
    const count = await Project.countDocuments({ _id: { $in: Array.from(projectIds) } });
    if (count !== projectIds.size) {
      throw new AppError("One or more projects are invalid", 400);
    }
  }

  if (taskIds.size) {
    const count = await Task.countDocuments({ _id: { $in: Array.from(taskIds) } });
    if (count !== taskIds.size) {
      throw new AppError("One or more tasks are invalid", 400);
    }
  }
};

const getUserContext = async (userId) => {
  const user = await User.findById(userId).select("userRole department isActive");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const ensureEntryAccess = async (entry, currentUser) => {
  if (currentUser.role === "admin") return;

  const user = await getUserContext(currentUser.userId);
  const employee = await User.findById(entry.employee).select("department");

  if (user.userRole === "manager") {
    if (!employee?.department || String(employee.department) !== String(user.department)) {
      throw new AppError("Forbidden", 403);
    }
    return;
  }

  if (String(entry.employee) !== String(currentUser.userId)) {
    throw new AppError("Forbidden", 403);
  }
};

const canEditEntry = async (entry, currentUser) => {
  if (currentUser.role === "admin") return true;

  const user = await getUserContext(currentUser.userId);
  const employee = await User.findById(entry.employee).select("department");

  if (user.userRole === "manager") {
    if (!employee?.department || String(employee.department) !== String(user.department)) {
      return false;
    }
    return isSameDay(entry.date, new Date());
  }

  if (String(entry.employee) !== String(currentUser.userId)) return false;

  const minutesSince = (Date.now() - new Date(entry.createdAt).getTime()) / 60000;
  if (minutesSince > EMPLOYEE_EDIT_WINDOW_MINUTES) return false;
  return isSameDay(entry.date, new Date());
};

export const createEntry = async (data, currentUser) => {
  const entryDate = parseDateOrThrow(data.date, "entry date");
  const employeeId = data.employeeId || currentUser.userId;

  const isManager = currentUser.role === "manager";
  const isAdmin = currentUser.role === "admin";

  if (!isAdmin && !isManager && String(employeeId) !== String(currentUser.userId)) {
    throw new AppError("You can only create your own entry", 403);
  }

  if (isManager) {
    const manager = await getUserContext(currentUser.userId);
    const employee = await User.findById(employeeId).select("department isActive");
    if (!employee || !employee.isActive) throw new AppError("Employee not found", 404);
    if (!employee.department || String(employee.department) !== String(manager.department)) {
      throw new AppError("You can only create entries for your department", 403);
    }
  }

  assertEntryDateAllowed(entryDate, currentUser.role);

  const existing = await Entry.findOne({ employee: employeeId, date: entryDate });
  if (existing) {
    throw new AppError("Entry already exists for this date", 409);
  }

  const timelineResult = validateTimeline(data.timeline, entryDate);
  await ensureTimelineReferences(timelineResult.timeline);

  const entry = new Entry({
    date: entryDate,
    employee: employeeId,
    createdBy: currentUser.userId,
    timeline: timelineResult.timeline,
    totalWorkMinutes: timelineResult.totalWorkMinutes,
    totalBreakMinutes: timelineResult.totalBreakMinutes,
    checkInTime: timelineResult.checkInTime,
    checkOutTime: timelineResult.checkOutTime,
    notes: data.notes || null,
  });

  return await entry.save();
};

export const getEntries = async (query, currentUser) => {
  const filter = {};

  if (query.from || query.to) {
    const fromDate = query.from ? parseDateOrThrow(query.from, "from date") : null;
    const toDate = query.to ? parseDateOrThrow(query.to, "to date") : null;
    filter.date = {};
    if (fromDate) filter.date.$gte = fromDate;
    if (toDate) filter.date.$lte = toDate;
  }

  if (query.status) filter.status = query.status;
  if (query.projectId) filter["timeline.project"] = query.projectId;
  if (query.taskId) filter["timeline.task"] = query.taskId;

  if (currentUser.role === "admin") {
    if (query.employeeId) filter.employee = query.employeeId;
  } else if (currentUser.role === "manager") {
    const manager = await getUserContext(currentUser.userId);
    const employees = await User.find({
      department: manager.department,
      isActive: true,
      userRole: { $ne: "admin" },
    }).select("_id");
    const employeeIds = employees.map((employee) => String(employee._id));

    if (query.employeeId && !employeeIds.includes(String(query.employeeId))) {
      throw new AppError("Forbidden", 403);
    }

    filter.employee = query.employeeId || { $in: employeeIds };
  } else {
    filter.employee = currentUser.userId;
  }

  const safePage = Math.max(1, Number(query.page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Entry.find(filter)
      .populate("employee", "fullName userEmail employeeCode department")
      .populate("createdBy", "fullName userEmail")
      .populate("timeline.project", "name code")
      .populate("timeline.task", "title status")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Entry.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const getEntryById = async (entryId, currentUser) => {
  const entry = await Entry.findById(entryId)
    .populate("employee", "fullName userEmail employeeCode department")
    .populate("createdBy", "fullName userEmail")
    .populate("timeline.project", "name code")
    .populate("timeline.task", "title status");

  if (!entry) throw new AppError("Entry not found", 404);

  await ensureEntryAccess(entry, currentUser);
  return entry;
};

export const updateEntry = async (entryId, data, currentUser) => {
  const entry = await Entry.findById(entryId);
  if (!entry) throw new AppError("Entry not found", 404);

  const canEdit = await canEditEntry(entry, currentUser);
  if (!canEdit) throw new AppError("Entry cannot be edited", 403);

  if (data.employeeId && currentUser.role !== "admin") {
    throw new AppError("Only admins can reassign entries", 403);
  }

  if (data.date) {
    const nextDate = parseDateOrThrow(data.date, "entry date");
    assertEntryDateAllowed(nextDate, currentUser.role);
    entry.date = nextDate;
  }

  if (data.employeeId) entry.employee = data.employeeId;
  if (data.notes !== undefined) entry.notes = data.notes;

  if (data.timeline) {
    const timelineResult = validateTimeline(data.timeline, entry.date);
    await ensureTimelineReferences(timelineResult.timeline);

    entry.timeline = timelineResult.timeline;
    entry.totalWorkMinutes = timelineResult.totalWorkMinutes;
    entry.totalBreakMinutes = timelineResult.totalBreakMinutes;
    entry.checkInTime = timelineResult.checkInTime;
    entry.checkOutTime = timelineResult.checkOutTime;
  }

  await entry.save();
  return entry;
};

export const updateEntryStatus = async (entryId, status, currentUser) => {
  const entry = await Entry.findById(entryId);
  if (!entry) throw new AppError("Entry not found", 404);

  if (currentUser.role !== "admin" && currentUser.role !== "manager") {
    throw new AppError("Forbidden", 403);
  }

  entry.status = status;
  entry.approvedBy = currentUser.userId;
  entry.approvedAt = new Date();
  await entry.save();

  return entry;
};
