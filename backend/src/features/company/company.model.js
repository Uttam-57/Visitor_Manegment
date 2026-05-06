import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    host: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    logo: { type: String }, // URL or base64 or path to logo
    portNo: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
