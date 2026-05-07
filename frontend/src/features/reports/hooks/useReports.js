import { useState } from "react";
import api from "../../../shared/services/api";
import { apiEndpoints } from "../../../shared/constants/api";

export const useReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (endpoint, params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(endpoint, { params });
      return res.data?.data || null;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyLogs = (params) => fetchReport(apiEndpoints.REPORTS.DAILY_LOGS, params);
  const getTimesheetSummary = (params) => fetchReport(apiEndpoints.REPORTS.TIMESHEET_SUMMARY, params);
  const getProjectProgress = (params) => fetchReport(apiEndpoints.REPORTS.PROJECT_PROGRESS, params);
  const getTaskStatus = (params) => fetchReport(apiEndpoints.REPORTS.TASK_STATUS, params);
  const getAttendance = (params) => fetchReport(apiEndpoints.REPORTS.ATTENDANCE, params);
  const getMissingEntries = (params) => fetchReport(apiEndpoints.REPORTS.MISSING_ENTRIES, params);

  return {
    isLoading,
    error,
    getDailyLogs,
    getTimesheetSummary,
    getProjectProgress,
    getTaskStatus,
    getAttendance,
    getMissingEntries,
  };
};
