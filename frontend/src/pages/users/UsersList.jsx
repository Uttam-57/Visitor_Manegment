import { useState, useEffect } from "react";
import api from "../../shared/services/api";
import { Button } from "../../shared/ui/atoms/Button";
import { Table } from "../../shared/ui/organisms/Table";
import Pagination from "../../shared/ui/molecules/Pagination/Pagination";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
  }, []);

  const fetchUsers = async (page, limit) => {
    setIsLoading(true);
    try {
      const res = await api.get("/users", { params: { page, limit } });
      const data = res.data?.data;
      setUsers(data?.users || []);
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
    fetchUsers(page, pagination.limit);
  };

  const handleLimitChange = (e) => {
    const nextLimit = Number(e.target.value);
    fetchUsers(1, nextLimit);
  };

  const columns = [
    { header: "Emp Code", accessor: "employeeCode" },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "userEmail" },
    { header: "Role", cell: (row) => <span className="capitalize font-medium text-primary-600 dark:text-primary-400">{row.userRole}</span> },
    { header: "Status", cell: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ) },
    { header: "Actions", cell: () => <Button size="sm" variant="outline">Edit</Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Users</h1>
        <Button>+ Add User</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-1">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : (
          <Table columns={columns} data={users} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-slate-500">Total: {pagination.total}</div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500" htmlFor="users-limit">Rows</label>
          <select
            id="users-limit"
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

export default UsersList;
