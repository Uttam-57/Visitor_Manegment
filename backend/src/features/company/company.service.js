import Company from "./company.model.js";
import AppError from "../../utils/appError.js";

export const createCompany = async (data) => {
  const company = new Company(data);
  return await company.save();
};

export const getAllCompanies = async () => {
  return await Company.find();
};

export const getCompanyById = async (id) => {
  const company = await Company.findById(id);
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

export const updateCompany = async (id, data) => {
  const company = await Company.findByIdAndUpdate(id, data, { new: true });
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

export const deleteCompany = async (id) => {
  const company = await Company.findByIdAndDelete(id);
  if (!company) throw new AppError("Company not found", 404);
  return company;
};
