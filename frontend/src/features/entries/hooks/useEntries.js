import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { apiEndpoints } from "../../../shared/constants/api";

const defaultPagination = { page: 1, limit: 10, totalPages: 1, total: 0 };

export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(apiEndpoints.ENTRIES.BASE, { params });
      const data = res.data?.data;
      setEntries(data?.items || []);
      setPagination({
        page: data?.pagination?.page || params.page || 1,
        limit: data?.pagination?.limit || params.limit || 10,
        totalPages: data?.pagination?.totalPages || 1,
        total: data?.pagination?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load entries.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEntry = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post(apiEndpoints.ENTRIES.BASE, payload);
      await fetchEntries({ page: 1, limit: pagination.limit });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create entry.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries({ page: pagination.page, limit: pagination.limit });
  }, [fetchEntries, pagination.page, pagination.limit]);

  return {
    entries,
    pagination,
    isLoading,
    error,
    fetchEntries,
    createEntry,
  };
};
