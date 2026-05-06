import { useState, useEffect } from "react";
import api from "../../shared/services/api";
import { Button } from "../../shared/ui/atoms/Button";
import { Table } from "../../shared/ui/organisms/Table";
import Pagination from "../../shared/ui/molecules/Pagination/Pagination";

const GatePassList = () => {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchPasses(pagination.page, pagination.limit);
  }, []);

  const fetchPasses = async (page, limit) => {
    setIsLoading(true);
    try {
      const res = await api.get("/gate-passes", { params: { page, limit } });
      const data = res.data?.data;
      setPasses(data?.items || []);
      setPagination((prev) => ({
        ...prev,
        page: data?.pagination?.page || page,
        limit: data?.pagination?.limit || limit,
        totalPages: data?.pagination?.totalPages || 1,
        total: data?.pagination?.total || 0,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchPasses(page, pagination.limit);
  };

  const handleLimitChange = (e) => {
    const nextLimit = Number(e.target.value);
    fetchPasses(1, nextLimit);
  };

  const columns = [
    { header: "Pass ID", accessor: "passId" },
    { header: "Purpose", accessor: "purpose" },
    { header: "Employee", cell: (row) => row.employee_id?.empName?.first || "N/A" },
    { header: "Type", cell: (row) => <span className="capitalize">{row.passType}</span> },
    { header: "Status", cell: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase
        ${row.status === 'approved' ? 'bg-green-100 text-green-700' : 
          row.status === 'reject' ? 'bg-red-100 text-red-700' : 
          row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
          'bg-blue-100 text-blue-700'}`}>
        {row.status}
      </span>
    ) },
    { header: "Date", cell: (row) => new Date(row.dateFrom).toLocaleDateString() },
    { header: "Actions", cell: () => <Button size="sm" variant="outline">View</Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gate Passes</h1>
        <Button>+ Create Pass</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading passes...</div>
        ) : (
          <Table columns={columns} data={passes} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-500">Total: {pagination.total}</div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500" htmlFor="passes-limit">Rows</label>
          <select
            id="passes-limit"
            className="border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 bg-white dark:bg-slate-900 text-sm"
            value={pagination.limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default GatePassList;
