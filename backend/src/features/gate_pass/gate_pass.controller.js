import * as gatePassService from "./gate_pass.service.js";

export const createGatePass = async (req, res, next) => {
  try {
    const gatePass = await gatePassService.createGatePass(req.body);
    res.status(201).json({ status: 201, success: true, message: "Gate Pass created", data: gatePass });
  } catch (error) {
    next(error);
  }
};

export const getAllGatePasses = async (req, res, next) => {
  try {
    const gatePasses = await gatePassService.getAllGatePasses(req.query);
    res.status(200).json({ status: 200, success: true, message: "Gate Passes retrieved", data: gatePasses });
  } catch (error) {
    next(error);
  }
};

export const getGatePassById = async (req, res, next) => {
  try {
    const gatePass = await gatePassService.getGatePassById(req.params.id);
    res.status(200).json({ status: 200, success: true, message: "Gate Pass retrieved", data: gatePass });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const gatePass = await gatePassService.updateGatePassStatus(req.params.id, req.body.status, userId);
    res.status(200).json({ status: 200, success: true, message: "Status updated", data: gatePass });
  } catch (error) {
    next(error);
  }
};
