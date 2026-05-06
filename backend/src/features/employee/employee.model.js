import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    empName: {
      first: { type: String, required: true, trim: true },
      middle: { type: String, trim: true },
      last: { type: String, required: true, trim: true },
    },
    emp_dep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
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

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
