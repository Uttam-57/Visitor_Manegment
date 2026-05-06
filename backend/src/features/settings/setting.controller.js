import * as settingService from "./setting.service.js";

export const createTemplate = async (req, res, next) => {
  try {
    const template = await settingService.createSettingTemplate(req.body);
    res.status(201).json({ success: true, message: "Template created", data: template });
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    const templates = await settingService.getSettingTemplates();
    res.status(200).json({ success: true, message: "Templates retrieved", data: templates });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const template = await settingService.updateSettingTemplate(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Template updated", data: template });
  } catch (error) {
    next(error);
  }
};

export const createSetting = async (req, res, next) => {
  try {
    const setting = await settingService.createSetting(req.body);
    res.status(201).json({ success: true, message: "Setting created", data: setting });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getSettings(req.query);
    res.status(200).json({ success: true, message: "Settings retrieved", data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const setting = await settingService.updateSetting(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Setting updated", data: setting });
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  try {
    await settingService.deleteSetting(req.params.id);
    res.status(200).json({ success: true, message: "Setting deleted", data: null });
  } catch (error) {
    next(error);
  }
};

export const getTree = async (req, res, next) => {
  try {
    const tree = await settingService.getSettingTree();
    res.status(200).json({ success: true, message: "Setting tree retrieved", data: tree });
  } catch (error) {
    next(error);
  }
};
