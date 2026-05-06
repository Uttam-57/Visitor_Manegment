import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    depName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    depCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
