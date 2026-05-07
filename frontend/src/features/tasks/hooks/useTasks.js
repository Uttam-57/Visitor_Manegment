import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { apiEndpoints } from "../../../shared/constants/api";

const defaultPagination = { page: 1, limit: 10, totalPages: 1, total: 0 };

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(apiEndpoints.TASKS.BASE, { params });
      const data = res.data?.data;
      setTasks(data?.items || []);
      setPagination({
        page: data?.pagination?.page || params.page || 1,
        limit: data?.pagination?.limit || params.limit || 10,
        totalPages: data?.pagination?.totalPages || 1,
        total: data?.pagination?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post(apiEndpoints.TASKS.BASE, payload);
      await fetchTasks({ page: 1, limit: pagination.limit });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks({ page: pagination.page, limit: pagination.limit });
  }, [fetchTasks, pagination.page, pagination.limit]);

  return {
    tasks,
    pagination,
    isLoading,
    error,
    fetchTasks,
    createTask,
  };
};
