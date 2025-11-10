"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Admin {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/admins`,
        { withCredentials: true }
      );
      setAdmins(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch admins");
      } else {
        toast.error("An unexpected error occurred while fetching admins.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const togglingToast = toast.loading(
      currentStatus ? "Deactivating admin..." : "Activating admin..."
    );
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/updateActiveStatus/${id}`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );

      toast.dismiss(togglingToast);

      if (res.status === 200) {
        toast.success("Admin status updated successfully!");
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === id ? { ...admin, isActive: !currentStatus } : admin
          )
        );
      } else {
        toast.warn("Unexpected response from server.");
      }
    } catch (err: unknown) {
      toast.dismiss(togglingToast);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update status");
      } else {
        toast.error("An unexpected error occurred while updating status.");
      }
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl mt-8 max-h-[50vh] overflow-scroll">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Current Admins
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : admins.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between items-center py-3"
            >
              <div>
                <p className="font-medium text-gray-800">{admin.name}</p>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={admin.isActive}
                    onChange={() =>
                      handleToggleActive(admin._id, admin.isActive)
                    }
                    color="primary"
                  />
                }
                label={admin.isActive ? "Active" : "Inactive"}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No admins found.</p>
      )}
    </div>
  );
}
