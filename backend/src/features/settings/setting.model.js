import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SettingTemplate",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
