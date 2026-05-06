import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    fieldType: { type: String, required: true }, // e.g., 'string', 'number', 'boolean', 'select'
    required: { type: Boolean, default: false },
    options: [{ type: String }], // For 'select' fieldType
  },
  { _id: false }
);

const settingTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: true }, // e.g., 'visitor_area', 'location'
    fields: [fieldSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SettingTemplate = mongoose.model("SettingTemplate", settingTemplateSchema);
export default SettingTemplate;
