"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface PerformedBy {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuditLog {
  _id: string;
  action: string;
  performedBy: PerformedBy;
  targetResource: string;
  targetId?: string;
  details?: string;
  userRole: string;
  ipAddress?: string;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    userRole: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit-logs/get-all`,
        {
          withCredentials: true,
          params: {
            page,
            limit: 10,
            ...filters,
          },
        }
      );

      setLogs(res.data.data);
      setPagination({
        page: res.data.pagination.page,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (err) {
      console.error("Error fetching logs:", err);
      toast.error("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchAuditLogs(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">System Audit Logs</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-3 mb-5">
        <input
          type="text"
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          placeholder="Filter by action"
          className="border rounded-lg px-3 py-2 text-sm w-full"
        />
        <select
          name="userRole"
          value={filters.userRole}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 text-sm w-full"
        >
          <option value="">All Roles</option>
          <option value="public">Public</option>
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 text-sm w-full"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 text-sm w-full"
        />
      </div>

      <button
        onClick={handleApplyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm mb-6"
      >
        Apply Filters
      </button>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-center py-8 text-gray-600">No audit logs found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Performed By</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Resource</th>
                <th className="px-4 py-3 text-left">IP Address</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3">
                    {log.performedBy?.name || "N/A"} <br />
                    <span className="text-xs text-gray-500">{log.performedBy?.email}</span>
                  </td>
                  <td className="px-4 py-3">{log.userRole}</td>
                  <td className="px-4 py-3">{log.targetResource}</td>
                  <td className="px-4 py-3 text-gray-600">{log.ipAddress || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => fetchAuditLogs(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchAuditLogs(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
