import Task from "./task.model.js";
import Project from "../project/project.model.js";
import User from "../user/user.model.js";
import AppError from "../../utils/appError.js";

const resolveCompletion = (status, completedAt) => {
  if (status === "done") {
    return completedAt ? new Date(completedAt) : new Date();
  }
  return null;
};

export const createTask = async (data, createdBy) => {
  const project = await Project.findById(data.project);
  if (!project) throw new AppError("Project not found", 404);

  if (data.assignee) {
    const assignee = await User.findById(data.assignee).select("_id");
    if (!assignee) throw new AppError("Assignee not found", 404);
  }

  const task = new Task({
    ...data,
    createdBy,
    completedAt: resolveCompletion(data.status, data.completedAt),
  });

  return await task.save();
};

export const getAllTasks = async ({
  search,
  project,
  assignee,
  status,
  priority,
  isActive,
  page = 1,
  limit = 20,
} = {}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (project) filter.project = project;
  if (assignee) filter.assignee = assignee;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (isActive !== undefined) filter.isActive = isActive;

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Task.find(filter)
      .populate("project", "name code status")
      .populate("assignee", "fullName userEmail")
      .populate("createdBy", "fullName userEmail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Task.countDocuments(filter),
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

export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("project", "name code status")
    .populate("assignee", "fullName userEmail")
    .populate("createdBy", "fullName userEmail");

  if (!task) throw new AppError("Task not found", 404);
  return task;
};

export const updateTask = async (id, data) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError("Task not found", 404);

  if (data.project) {
    const project = await Project.findById(data.project).select("_id");
    if (!project) throw new AppError("Project not found", 404);
  }

  if (data.assignee) {
    const assignee = await User.findById(data.assignee).select("_id");
    if (!assignee) throw new AppError("Assignee not found", 404);
  }

  const nextStatus = data.status || task.status;
  const completedAt = resolveCompletion(nextStatus, data.completedAt || task.completedAt);

  Object.assign(task, data, { completedAt });
  await task.save();
  return task;
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
};
