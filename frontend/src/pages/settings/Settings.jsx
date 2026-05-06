import { useState, useEffect } from "react";
import api from "../../shared/services/api";
import { Button } from "../../shared/ui/atoms/Button";
import { Table } from "../../shared/ui/organisms/Table";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "templates") {
        const res = await api.get("/settings/templates");
        setTemplates(res.data.data);
      } else {
        const res = await api.get("/settings");
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const templateColumns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Fields Count", cell: (row) => row.fields?.length || 0 },
    { header: "Status", cell: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ) },
    { header: "Actions", cell: () => <Button size="sm" variant="outline">Edit</Button> }
  ];

  const settingColumns = [
    { header: "Template Type", cell: (row) => row.template?.name || row.type },
    { header: "Value", cell: (row) => JSON.stringify(row.value).substring(0, 50) + "..." },
    { header: "Status", cell: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ) },
    { header: "Actions", cell: () => <Button size="sm" variant="outline">Edit</Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings Management</h1>
        <Button>+ Add New</Button>
      </div>

      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("templates")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "templates"
              ? "border-primary-500 text-primary-600 dark:text-primary-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
          }`}
        >
          Setting Templates
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-primary-500 text-primary-600 dark:text-primary-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
          }`}
        >
          Setting Values
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <Table 
            columns={activeTab === "templates" ? templateColumns : settingColumns} 
            data={activeTab === "templates" ? templates : settings} 
          />
        )}
      </div>
    </div>
  );
};

export default Settings;
