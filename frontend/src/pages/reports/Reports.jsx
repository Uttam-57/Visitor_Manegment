import { useMemo, useState } from "react";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { Table } from "../../shared/ui/organisms/Table";
import Tabs from "../../shared/ui/molecules/Tabs";
import { useReports } from "../../features/reports/hooks/useReports";

const Reports = () => {
  const { isLoading, error, getDailyLogs, getTimesheetSummary, getProjectProgress, getTaskStatus, getAttendance, getMissingEntries } = useReports();
  const [activeTab, setActiveTab] = useState("dailyLogs");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    employeeId: "",
    departmentId: "",
    projectId: "",
    taskId: "",
    assigneeId: "",
  });
  const [data, setData] = useState({
    dailyLogs: [],
    timesheet: [],
    projectProgress: null,
    taskStatus: [],
    attendance: [],
    missingEntries: [],
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const loadReport = async (type) => {
    if (type === "projectProgress" && !filters.projectId) return;

    let result = null;
    if (type === "dailyLogs") result = await getDailyLogs(filters);
    if (type === "timesheet") result = await getTimesheetSummary(filters);
    if (type === "projectProgress") result = await getProjectProgress({
      from: filters.from,
      to: filters.to,
      projectId: filters.projectId,
    });
    if (type === "taskStatus") result = await getTaskStatus({
      from: filters.from,
      to: filters.to,
      projectId: filters.projectId,
      departmentId: filters.departmentId,
      assigneeId: filters.assigneeId,
    });
    if (type === "attendance") result = await getAttendance(filters);
    if (type === "missingEntries") result = await getMissingEntries({
      date: filters.from || undefined,
      departmentId: filters.departmentId || undefined,
    });

    if (result !== null) {
      setData((prev) => ({ ...prev, [type]: result }));
    }
  };

  const dailyColumns = useMemo(
    () => [
      { header: "Date", cell: (row) => new Date(row.date).toLocaleDateString() },
      { header: "Employee", cell: (row) => row.employee?.fullName || row.employee?.userEmail || "-" },
      { header: "Work (min)", accessor: "totalWorkMinutes" },
      { header: "Break (min)", accessor: "totalBreakMinutes" },
      { header: "Status", cell: (row) => <span className="capitalize">{row.status}</span> },
    ],
    []
  );

  const timesheetColumns = useMemo(
    () => [
      { header: "Employee", cell: (row) => row.employee?.fullName || row.employee?.userEmail || "-" },
      { header: "Entries", accessor: "totalEntries" },
      { header: "Work (min)", accessor: "totalWorkMinutes" },
      { header: "Break (min)", accessor: "totalBreakMinutes" },
    ],
    []
  );

  const taskColumns = useMemo(
    () => [
      { header: "Title", accessor: "title" },
      { header: "Project", cell: (row) => row.project?.name || "-" },
      { header: "Assignee", cell: (row) => row.assignee?.fullName || row.assignee?.userEmail || "-" },
      { header: "Status", cell: (row) => <span className="capitalize">{row.status}</span> },
    ],
    []
  );

  const attendanceColumns = useMemo(
    () => [
      { header: "Date", cell: (row) => new Date(row.date).toLocaleDateString() },
      { header: "Employee", cell: (row) => row.employee?.fullName || row.employee?.userEmail || "-" },
      { header: "Check In", cell: (row) => row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : "-" },
      { header: "Check Out", cell: (row) => row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : "-" },
      { header: "Work (min)", accessor: "totalWorkMinutes" },
    ],
    []
  );

  const missingColumns = useMemo(
    () => [
      { header: "Employee", cell: (row) => row.fullName || row.userEmail || "-" },
      { header: "Employee Code", accessor: "employeeCode" },
    ],
    []
  );

  const renderProjectProgress = () => {
    if (!filters.projectId) {
      return <div className="text-sm text-slate-500">Enter a project ID to load progress.</div>;
    }

    if (!data.projectProgress) {
      return <div className="text-sm text-slate-500">No data yet. Run the report.</div>;
    }

    const { project, taskCounts, totalWorkMinutes } = data.projectProgress;
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project?.name || "Project"}</h3>
          <p className="text-sm text-slate-500">Code: {project?.code || "-"} | Status: {project?.status || "-"}</p>
          <p className="text-sm text-slate-500 mt-2">Total Work Minutes: {totalWorkMinutes}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {taskCounts?.length ? taskCounts.map((item) => (
            <div key={item._id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <p className="text-sm text-slate-500">{item._id}</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">{item.total}</p>
            </div>
          )) : <div className="text-sm text-slate-500">No tasks found for this project.</div>}
        </div>
      </div>
    );
  };

  const tabs = [
    {
      label: "Daily Logs",
      value: "dailyLogs",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("dailyLogs")} isLoading={isLoading}>Run Daily Logs</Button>
          <Table columns={dailyColumns} data={data.dailyLogs} />
        </div>
      ),
    },
    {
      label: "Timesheet",
      value: "timesheet",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("timesheet")} isLoading={isLoading}>Run Timesheet</Button>
          <Table columns={timesheetColumns} data={data.timesheet} />
        </div>
      ),
    },
    {
      label: "Project Progress",
      value: "projectProgress",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("projectProgress")} isLoading={isLoading}>Run Project Progress</Button>
          {renderProjectProgress()}
        </div>
      ),
    },
    {
      label: "Task Status",
      value: "taskStatus",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("taskStatus")} isLoading={isLoading}>Run Task Status</Button>
          <Table columns={taskColumns} data={data.taskStatus} />
        </div>
      ),
    },
    {
      label: "Attendance",
      value: "attendance",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("attendance")} isLoading={isLoading}>Run Attendance</Button>
          <Table columns={attendanceColumns} data={data.attendance} />
        </div>
      ),
    },
    {
      label: "Missing Entries",
      value: "missingEntries",
      content: (
        <div className="space-y-4">
          <Button onClick={() => loadReport("missingEntries")} isLoading={isLoading}>Run Missing Entries</Button>
          <Table columns={missingColumns} data={data.missingEntries} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
        <Input id="from" label="From" type="date" value={filters.from} onChange={handleFilterChange} />
        <Input id="to" label="To" type="date" value={filters.to} onChange={handleFilterChange} />
        <Input id="employeeId" label="Employee ID" value={filters.employeeId} onChange={handleFilterChange} />
        <Input id="departmentId" label="Department ID" value={filters.departmentId} onChange={handleFilterChange} />
        <Input id="projectId" label="Project ID" value={filters.projectId} onChange={handleFilterChange} />
        <Input id="taskId" label="Task ID" value={filters.taskId} onChange={handleFilterChange} />
        <Input id="assigneeId" label="Assignee ID" value={filters.assigneeId} onChange={handleFilterChange} />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
        <Tabs items={tabs} value={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Reports;
