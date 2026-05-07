import Project from "./project.model.js";
import AppError from "../../utils/appError.js";

export const createProject = async (data) => {
  const existing = await Project.findOne({
    $or: [{ code: data.code?.toUpperCase() }, { name: data.name }],
  });

  if (existing) {
    throw new AppError("Project name or code already exists", 409);
  }

  const members = new Set([...(data.members || []), data.manager]);
  const project = new Project({
    ...data,
    code: data.code?.toUpperCase(),
    members: Array.from(members),
  });

  return await project.save();
};

export const getAllProjects = async ({
  search,
  department,
  manager,
  status,
  isActive,
  page = 1,
  limit = 20,
} = {}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  if (department) filter.department = department;
  if (manager) filter.manager = manager;
  if (status) filter.status = status;
  if (isActive !== undefined) filter.isActive = isActive;

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate("department", "depName depCode")
      .populate("manager", "fullName userEmail")
      .populate("members", "fullName userEmail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Project.countDocuments(filter),
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

export const getProjectById = async (id) => {
  const project = await Project.findById(id)
    .populate("department", "depName depCode")
    .populate("manager", "fullName userEmail")
    .populate("members", "fullName userEmail");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const updateProject = async (id, data) => {
  if (data.code) data.code = data.code.toUpperCase();

  const project = await Project.findById(id);
  if (!project) throw new AppError("Project not found", 404);

  if (data.members || data.manager) {
    const members = new Set([...(data.members || project.members || []), data.manager || project.manager]);
    data.members = Array.from(members);
  }

  Object.assign(project, data);
  await project.save();

  return project;
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw new AppError("Project not found", 404);
  return project;
};
