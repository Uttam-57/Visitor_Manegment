import * as entryService from "./entry.service.js";

export const createEntry = async (req, res, next) => {
  try {
    const entry = await entryService.createEntry(req.body, req.user);
    res.status(201).json({ success: true, message: "Entry created", data: entry });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const entries = await entryService.getEntries(req.query, req.user);
    res.status(200).json({ success: true, message: "Entries retrieved", data: entries });
  } catch (error) {
    next(error);
  }
};

export const getEntryById = async (req, res, next) => {
  try {
    const entry = await entryService.getEntryById(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Entry retrieved", data: entry });
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const entry = await entryService.updateEntry(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, message: "Entry updated", data: entry });
  } catch (error) {
    next(error);
  }
};

export const updateEntryStatus = async (req, res, next) => {
  try {
    const entry = await entryService.updateEntryStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, message: "Entry status updated", data: entry });
  } catch (error) {
    next(error);
  }
};
