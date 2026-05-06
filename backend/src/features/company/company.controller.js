import * as companyService from "./company.service.js";

export const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json({ success: true, message: "Company created", data: company });
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json({ success: true, message: "Companies retrieved", data: companies });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.status(200).json({ success: true, message: "Company retrieved", data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Company updated", data: company });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    await companyService.deleteCompany(req.params.id);
    res.status(200).json({ success: true, message: "Company deleted", data: null });
  } catch (error) {
    next(error);
  }
};
