import * as taskService from "./task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.userId);
    res.status(201).json({ success: true, message: "Task created", data: task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.query);
    res.status(200).json({ success: true, message: "Tasks retrieved", data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({ success: true, message: "Task retrieved", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted", data: null });
  } catch (error) {
    next(error);
  }
};
