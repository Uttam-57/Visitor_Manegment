import { useMemo, useState } from "react";
import { useEntries } from "../../features/entries/hooks/useEntries";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { Table } from "../../shared/ui/organisms/Table";
import Pagination from "../../shared/ui/molecules/Pagination/Pagination";

const buildDateTime = (date, time) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}`);
  if (Number.isNaN(value.getTime())) return null;
  return value.toISOString();
};

const Entries = () => {
  const { entries, pagination, isLoading, error, fetchEntries, createEntry } = useEntries();
  const [filters, setFilters] = useState({ from: "", to: "", employeeId: "" });
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    workStart: "",
    breakStart: "",
    breakEnd: "",
    workEnd: "",
    projectId: "",
    taskId: "",
    employeeId: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEntries({ ...filters, page: 1, limit: pagination.limit });
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const buildTimelinePayload = () => {
    const { date, workStart, breakStart, breakEnd, workEnd, projectId, taskId } = form;
    const start = buildDateTime(date, workStart);
    const end = buildDateTime(date, workEnd);

    if (!start || !end) return { error: "Work start and end times are required." };

    if ((breakStart && !breakEnd) || (!breakStart && breakEnd)) {
      return { error: "Break start and end must both be provided." };
    }

    const timeline = [];

    if (!breakStart) {
      timeline.push({
        type: "work",
        project: projectId.trim(),
        task: taskId.trim() || null,
        startTime: start,
        endTime: end,
      });
      return { timeline };
    }

    const breakStartIso = buildDateTime(date, breakStart);
    const breakEndIso = buildDateTime(date, breakEnd);

    if (!breakStartIso || !breakEndIso) {
      return { error: "Break times are invalid." };
    }

    if (!(start < breakStartIso && breakStartIso < breakEndIso && breakEndIso < end)) {
      return { error: "Break must be within working hours with no overlaps." };
    }

    timeline.push({
      type: "work",
      project: projectId.trim(),
      task: taskId.trim() || null,
      startTime: start,
      endTime: breakStartIso,
    });
    timeline.push({
      type: "break",
      startTime: breakStartIso,
      endTime: breakEndIso,
    });
    timeline.push({
      type: "work",
      project: projectId.trim(),
      task: taskId.trim() || null,
      startTime: breakEndIso,
      endTime: end,
    });

    return { timeline };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    const { timeline, error: timelineError } = buildTimelinePayload();
    if (timelineError) {
      setFormError(timelineError);
      return;
    }

    if (!form.projectId.trim()) {
      setFormError("Project ID is required.");
      return;
    }

    const payload = {
      date: form.date,
      notes: form.notes.trim() || null,
      timeline,
    };

    if (form.employeeId.trim()) {
      payload.employeeId = form.employeeId.trim();
    }

    const ok = await createEntry(payload);
    if (ok) {
      setForm((prev) => ({
        ...prev,
        workStart: "",
        breakStart: "",
        breakEnd: "",
        workEnd: "",
        projectId: "",
        taskId: "",
        employeeId: "",
        notes: "",
      }));
    }
  };

  const columns = useMemo(
    () => [
      { header: "Date", cell: (row) => new Date(row.date).toLocaleDateString() },
      { header: "Employee", cell: (row) => row.employee?.fullName || row.employee?.userEmail || "-" },
      { header: "Work (min)", accessor: "totalWorkMinutes" },
      { header: "Break (min)", accessor: "totalBreakMinutes" },
      { header: "Check In", cell: (row) => row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : "-" },
      { header: "Check Out", cell: (row) => row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : "-" },
      { header: "Status", cell: (row) => <span className="capitalize">{row.status}</span> },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Entries</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Log daily work timeline with strict rules.</p>
      </div>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm">
        <Input id="date" label="Entry Date" type="date" value={form.date} onChange={handleFormChange} required />
        <Input id="workStart" label="Work Start" type="time" value={form.workStart} onChange={handleFormChange} required />
        <Input id="workEnd" label="Work End" type="time" value={form.workEnd} onChange={handleFormChange} required />
        <Input id="breakStart" label="Break Start" type="time" value={form.breakStart} onChange={handleFormChange} />
        <Input id="breakEnd" label="Break End" type="time" value={form.breakEnd} onChange={handleFormChange} />
        <Input id="projectId" label="Project ID" value={form.projectId} onChange={handleFormChange} required />
        <Input id="taskId" label="Task ID (optional)" value={form.taskId} onChange={handleFormChange} />
        <Input id="employeeId" label="Employee ID (manager/admin)" value={form.employeeId} onChange={handleFormChange} />
        <Input id="notes" label="Notes" value={form.notes} onChange={handleFormChange} />
        {formError && <div className="md:col-span-3 text-sm text-red-600">{formError}</div>}
        <div className="md:col-span-3 flex justify-end">
          <Button type="submit" isLoading={isLoading}>Submit Entry</Button>
        </div>
      </form>

      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
        <Input id="from" label="From" type="date" value={filters.from} onChange={handleFilterChange} />
        <Input id="to" label="To" type="date" value={filters.to} onChange={handleFilterChange} />
        <Input id="employeeId" label="Employee ID" value={filters.employeeId} onChange={handleFilterChange} />
        <div className="flex items-end">
          <Button type="submit" variant="secondary">Apply Filters</Button>
        </div>
      </form>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading entries...</div>
        ) : (
          <Table columns={columns} data={entries} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-500">Total: {pagination.total}</div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => fetchEntries({ ...filters, page, limit: pagination.limit })}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default Entries;
