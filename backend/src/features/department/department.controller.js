import * as departmentService from "./department.service.js";

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartments = async (req, res, next) => {
  try {
    const filter = req.query.isActive !== undefined ? { isActive: req.query.isActive === 'true' } : {};
    const departments = await departmentService.getAllDepartments(filter);
    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleActiveStatus = async (req, res, next) => {
  try {
    const department = await departmentService.toggleActiveStatus(req.params.id, req.body.isActive);
    res.status(200).json({
      success: true,
      message: `Department status updated to ${req.body.isActive ? 'active' : 'inactive'}`,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
