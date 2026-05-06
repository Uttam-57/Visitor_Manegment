import { useCallback, useEffect, useState } from "react";
import api from "../../../shared/services/api";

export const useSettings = (activeTab) => {
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (activeTab === "templates") {
        const res = await api.get("/settings/templates");
        setTemplates(res.data?.data || []);
      } else {
        const res = await api.get("/settings");
        setSettings(res.data?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const createTemplate = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/settings/templates", payload);
      await fetchData();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create template.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createSetting = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/settings", payload);
      await fetchData();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create setting.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    templates,
    settings,
    isLoading,
    error,
    fetchData,
    createTemplate,
    createSetting,
  };
};
