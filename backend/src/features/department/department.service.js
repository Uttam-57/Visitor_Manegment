import Department from "./department.model.js";
import AppError from "../../utils/appError.js";

export const createDepartment = async (data) => {
  const existingDep = await Department.findOne({
    $or: [{ depCode: data.depCode }, { depName: data.depName }],
  });
  if (existingDep) {
    throw new AppError("Department with same name or code already exists", 400);
  }
  const department = new Department(data);
  return await department.save();
};

export const getAllDepartments = async (filter = {}) => {
  return await Department.find(filter).sort({ createdAt: -1 });
};

export const getDepartmentById = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};

export const updateDepartment = async (id, data) => {
  const department = await Department.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};

export const deleteDepartment = async (id) => {
  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};

export const toggleActiveStatus = async (id, isActive) => {
  const department = await Department.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );
  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};
