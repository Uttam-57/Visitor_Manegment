import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { apiEndpoints } from "../../../shared/constants/api";

const defaultPagination = { page: 1, limit: 10, totalPages: 1, total: 0 };

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(apiEndpoints.PROJECTS.BASE, { params });
      const data = res.data?.data;
      setProjects(data?.items || []);
      setPagination({
        page: data?.pagination?.page || params.page || 1,
        limit: data?.pagination?.limit || params.limit || 10,
        totalPages: data?.pagination?.totalPages || 1,
        total: data?.pagination?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post(apiEndpoints.PROJECTS.BASE, payload);
      await fetchProjects({ page: 1, limit: pagination.limit });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects({ page: pagination.page, limit: pagination.limit });
  }, [fetchProjects, pagination.page, pagination.limit]);

  return {
    projects,
    pagination,
    isLoading,
    error,
    fetchProjects,
    createProject,
  };
};
