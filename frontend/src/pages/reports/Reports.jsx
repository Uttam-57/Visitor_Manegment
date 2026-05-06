import { useEffect, useState } from "react";
import api from "../../shared/services/api";
import { Button } from "../../shared/ui/atoms/Button";
import { Input } from "../../shared/ui/atoms/Input";
import { Table } from "../../shared/ui/organisms/Table";

const Reports = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    employeeId: "",
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/gate-passes", { params: filters });
      setRows(res.data?.data?.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const columns = [
    { header: "Pass ID", accessor: "passId" },
    { header: "Employee", cell: (row) => row.employee_id?.empName || "N/A" },
    { header: "Purpose", accessor: "purpose" },
    { header: "Status", accessor: "status" },
    { header: "From", cell: (row) => row.dateFrom ? new Date(row.dateFrom).toLocaleString() : "-" },
    { header: "To", cell: (row) => row.dateTo ? new Date(row.dateTo).toLocaleString() : "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gate Pass Reports</h1>
        <Button variant="outline" onClick={fetchReport}>Refresh</Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
        <Input id="status" label="Status" placeholder="approved / pending" value={filters.status} onChange={handleChange} />
        <Input id="employeeId" label="Employee ID" placeholder="EMP-001" value={filters.employeeId} onChange={handleChange} />
        <Input id="from" label="From" type="date" value={filters.from} onChange={handleChange} />
        <Input id="to" label="To" type="date" value={filters.to} onChange={handleChange} />
        <div className="md:col-span-4 flex justify-end">
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading report...</div>
        ) : (
          <Table columns={columns} data={rows} />
        )}
      </div>
    </div>
  );
};

export default Reports;
