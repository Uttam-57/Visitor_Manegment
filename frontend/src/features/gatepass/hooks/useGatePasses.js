import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";

const defaultPagination = { page: 1, limit: 10, totalPages: 1, total: 0 };

export const useGatePasses = () => {
  const [passes, setPasses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(defaultPagination);

  const fetchPasses = useCallback(async (page = pagination.page, limit = pagination.limit) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get("/gate-passes", { params: { page, limit } });
      const data = res.data?.data;
      setPasses(data?.items || []);
      setPagination({
        page: data?.pagination?.page || page,
        limit: data?.pagination?.limit || limit,
        totalPages: data?.pagination?.totalPages || 1,
        total: data?.pagination?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load gate passes.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data?.data || []);
    } catch {
      setEmployees([]);
    }
  }, []);

  const createPass = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/gate-passes", payload);
      await fetchPasses(1, pagination.limit);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gate pass.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
    fetchEmployees();
  }, [fetchPasses, fetchEmployees]);

  return {
    passes,
    employees,
    isLoading,
    error,
    pagination,
    fetchPasses,
    createPass,
  };
};
