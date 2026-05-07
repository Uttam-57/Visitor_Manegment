import { useState } from "react";
import { useProjects } from "../../features/projects/hooks/useProjects";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { Table } from "../../shared/ui/organisms/Table";
import Pagination from "../../shared/ui/molecules/Pagination/Pagination";

const ProjectsList = () => {
  const { projects, pagination, isLoading, error, fetchProjects, createProject } = useProjects();
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    department: "",
    manager: "",
    status: "active",
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProjects({ ...filters, page: 1, limit: pagination.limit });
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      department: form.department.trim(),
      manager: form.manager.trim(),
      status: form.status,
    };

    const ok = await createProject(payload);
    if (ok) {
      setForm({ code: "", name: "", description: "", department: "", manager: "", status: "active" });
      setShowForm(false);
    }
  };

  const columns = [
    { header: "Code", accessor: "code" },
    { header: "Name", accessor: "name" },
    { header: "Department", cell: (row) => row.department?.depName || "-" },
    { header: "Manager", cell: (row) => row.manager?.fullName || row.manager?.userEmail || "-" },
    { header: "Members", cell: (row) => row.members?.length || 0 },
    { header: "Status", cell: (row) => <span className="capitalize">{row.status}</span> },
    { header: "Active", cell: (row) => (row.isActive ? "Yes" : "No") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage projects and assignments.</p>
        </div>
        <Button variant="outline" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "+ New Project"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm">
          <Input id="projectCode" name="code" label="Project Code" value={form.code} onChange={handleFormChange} required />
          <Input id="projectName" name="name" label="Project Name" value={form.name} onChange={handleFormChange} required />
          <Input id="projectDepartment" name="department" label="Department ID" value={form.department} onChange={handleFormChange} required />
          <Input id="projectManager" name="manager" label="Manager User ID" value={form.manager} onChange={handleFormChange} required />
          <Input id="projectDescription" name="description" label="Description" value={form.description} onChange={handleFormChange} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="projectStatus">Status</label>
            <select
              id="projectStatus"
              name="status"
              className="block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100"
              value={form.status}
              onChange={handleFormChange}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="submit" isLoading={isLoading}>Create Project</Button>
          </div>
        </form>
      )}

      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
        <Input id="projectSearch" name="search" label="Search" placeholder="name or code" value={filters.search} onChange={handleFilterChange} />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="projectFilterStatus">Status</label>
          <select
            id="projectFilterStatus"
            name="status"
            className="block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="secondary">Apply Filters</Button>
        </div>
      </form>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading projects...</div>
        ) : (
          <Table columns={columns} data={projects} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-500">Total: {pagination.total}</div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => fetchProjects({ ...filters, page, limit: pagination.limit })}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ProjectsList;
