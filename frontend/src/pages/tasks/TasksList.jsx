import { useState } from "react";
import { useTasks } from "../../features/tasks/hooks/useTasks";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { Table } from "../../shared/ui/organisms/Table";
import Pagination from "../../shared/ui/molecules/Pagination/Pagination";

const TasksList = () => {
  const { tasks, pagination, isLoading, error, fetchTasks, createTask } = useTasks();
  const [filters, setFilters] = useState({ search: "", status: "", project: "", assignee: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    project: "",
    title: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    startDate: "",
    dueDate: "",
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTasks({ ...filters, page: 1, limit: pagination.limit });
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      project: form.project.trim(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      assignee: form.assignee.trim() || null,
      status: form.status,
      priority: form.priority,
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
    };

    const ok = await createTask(payload);
    if (ok) {
      setForm({
        project: "",
        title: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        startDate: "",
        dueDate: "",
      });
      setShowForm(false);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Project", cell: (row) => row.project?.name || "-" },
    { header: "Assignee", cell: (row) => row.assignee?.fullName || row.assignee?.userEmail || "-" },
    { header: "Status", cell: (row) => <span className="capitalize">{row.status}</span> },
    { header: "Priority", cell: (row) => <span className="capitalize">{row.priority}</span> },
    { header: "Due", cell: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track tasks and assignments.</p>
        </div>
        <Button variant="outline" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close" : "+ New Task"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm">
          <Input id="project" label="Project ID" value={form.project} onChange={handleFormChange} required />
          <Input id="title" label="Title" value={form.title} onChange={handleFormChange} required />
          <Input id="assignee" label="Assignee User ID" value={form.assignee} onChange={handleFormChange} />
          <Input id="description" label="Description" value={form.description} onChange={handleFormChange} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="status">Status</label>
            <select
              id="status"
              className="block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100"
              value={form.status}
              onChange={handleFormChange}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100"
              value={form.priority}
              onChange={handleFormChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input id="startDate" label="Start Date" type="date" value={form.startDate} onChange={handleFormChange} />
          <Input id="dueDate" label="Due Date" type="date" value={form.dueDate} onChange={handleFormChange} />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" isLoading={isLoading}>Create Task</Button>
          </div>
        </form>
      )}

      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
        <Input id="search" label="Search" placeholder="title or description" value={filters.search} onChange={handleFilterChange} />
        <Input id="project" label="Project ID" value={filters.project} onChange={handleFilterChange} />
        <Input id="assignee" label="Assignee ID" value={filters.assignee} onChange={handleFilterChange} />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="status">Status</label>
          <select
            id="status"
            className="block w-full rounded-lg border bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-slate-900 dark:text-slate-100"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <Button type="submit" variant="secondary">Apply Filters</Button>
        </div>
      </form>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading tasks...</div>
        ) : (
          <Table columns={columns} data={tasks} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-500">Total: {pagination.total}</div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => fetchTasks({ ...filters, page, limit: pagination.limit })}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default TasksList;
