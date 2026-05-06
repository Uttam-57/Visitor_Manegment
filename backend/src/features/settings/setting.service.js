import SettingTemplate from "./settingTemplate.model.js";
import Setting from "./setting.model.js";
import AppError from "../../utils/appError.js";

// Template Methods
export const createSettingTemplate = async (data) => {
  const existing = await SettingTemplate.findOne({ type: data.type });
  if (existing) {
    throw new AppError("Setting template for this type already exists", 400);
  }
  const template = new SettingTemplate(data);
  return await template.save();
};

export const getSettingTemplates = async () => {
  return await SettingTemplate.find();
};

export const updateSettingTemplate = async (id, data) => {
  const template = await SettingTemplate.findByIdAndUpdate(id, data, { new: true });
  if (!template) throw new AppError("Template not found", 404);
  return template;
};

// Setting Methods
export const createSetting = async (data) => {
  const template = await SettingTemplate.findById(data.template);
  if (!template) throw new AppError("Template not found", 404);
  
  // Validate values against template fields here if needed
  
  const setting = new Setting(data);
  return await setting.save();
};

export const getSettings = async (filter = {}) => {
  return await Setting.find(filter).populate("template", "name type fields");
};

export const updateSetting = async (id, data) => {
  const setting = await Setting.findByIdAndUpdate(id, data, { new: true });
  if (!setting) throw new AppError("Setting not found", 404);
  return setting;
};

export const deleteSetting = async (id) => {
  const setting = await Setting.findByIdAndDelete(id);
  if (!setting) throw new AppError("Setting not found", 404);
  return setting;
};

export const getSettingTree = async () => {
  // Groups settings by type
  const settings = await Setting.find({ isActive: true }).populate("template", "name");
  const tree = {};
  settings.forEach(s => {
    if (!tree[s.type]) tree[s.type] = [];
    tree[s.type].push(s);
  });
  return tree;
};
