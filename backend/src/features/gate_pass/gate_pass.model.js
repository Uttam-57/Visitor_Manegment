import mongoose from "mongoose";

const visitorDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    company: { type: String },
    idProofType: { type: String },
    idProofNumber: { type: String },
    photo: { type: String },
    itemCarryWith: [{ type: String }],
    visitorCount: { type: Number, default: 1 },
    description: { type: String },
  },
  { _id: true }
);

const gatePassSchema = new mongoose.Schema(
  {
    passType: { type: String, enum: ["singleday", "multipleday"], required: true },
    passId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["created", "pending", "approved", "reject", "check in", "check out", "cancelled"],
      default: "created",
    },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },
    visitingArea: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },
    visitorType: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },
    purpose: { type: String, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    approvedAt: { type: Date },
    visitors: [visitorDetailSchema],
  },
  { timestamps: true }
);

const GatePass = mongoose.model("GatePass", gatePassSchema);
export default GatePass;
