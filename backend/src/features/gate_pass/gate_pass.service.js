import GatePass from "./gate_pass.model.js";
import AppError from "../../utils/appError.js";
import crypto from "crypto";

export const createGatePass = async (data) => {
  // Generate a unique passId
  data.passId = "PASS-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const gatePass = new GatePass(data);
  return await gatePass.save();
};

export const getAllGatePasses = async ({
  status,
  employeeId,
  from,
  to,
  page = 1,
  limit = 20,
} = {}) => {
  const filter = {};

  if (status) filter.status = status;
  if (employeeId) filter.employee_id = employeeId;
  if (from || to) {
    filter.dateFrom = {};
    if (from) filter.dateFrom.$gte = new Date(from);
    if (to) filter.dateFrom.$lte = new Date(to);
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    GatePass.find(filter)
      .select("passId purpose passType status dateFrom dateTo employee_id createdBy createdAt checkInTime checkOutTime")
      .populate("employee_id", "empName empId")
      .populate("createdBy", "fullName userEmail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    GatePass.countDocuments(filter),
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

export const getGatePassById = async (id) => {
  const gatePass = await GatePass.findById(id)
    .populate("employee_id", "empName empId")
    .populate("createdBy", "fullName email");
  if (!gatePass) throw new AppError("GatePass not found", 404);
  return gatePass;
};

export const updateGatePassStatus = async (id, status, userId) => {
  const gatePass = await GatePass.findById(id);
  if (!gatePass) throw new AppError("GatePass not found", 404);

  gatePass.status = status;

  if (status === "approved" || status === "reject") {
    gatePass.approver_id = userId;
    gatePass.approvedAt = new Date();
  } else if (status === "check in") {
    gatePass.checkInTime = new Date();
  } else if (status === "check out") {
    gatePass.checkOutTime = new Date();
  }

  await gatePass.save();
  return gatePass;
};
