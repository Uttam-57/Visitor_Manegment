import Employee from "./employee.model.js";
import AppError from "../../utils/appError.js";

export const createEmployee = async (data) => {
  const existingEmp = await Employee.findOne({ empId: data.empId });
  if (existingEmp) {
    throw new AppError("Employee with same ID already exists", 400);
  }
  const employee = new Employee(data);
  return await employee.save();
};

export const getAllEmployees = async (filter = {}) => {
  return await Employee.find(filter)
    .populate("emp_dep", "depName depCode")
    .populate("manager_id", "empName empId")
    .sort({ createdAt: -1 });
};

export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate("emp_dep", "depName depCode")
    .populate("manager_id", "empName empId");
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }
  return employee;
};

export const updateEmployee = async (id, data) => {
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }
  return employee;
};

export const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }
  return employee;
};
