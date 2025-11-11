"use client";

import React, { useState, useMemo, useEffect } from "react";
import Dialog from "../Dialog/Dialog";
import axios from "axios";
import Switch from "@mui/material/Switch";

interface Crime {
  _id: string;
  title: string;
  type: string;
  description: string;
  datetime: string;
  isVerified: boolean;
  verifiedBy: unknown;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalCrimesReported: number;
  crimes: Crime[];
}

export default function UserDetailsDialog({
  isOpen,
  onClose,
  user,
  onStatusChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onStatusChange?: (updatedUser: UserData) => void;
}) {
  const [localUser, setLocalUser] = useState<UserData | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // ✅ keep localUser synced with incoming prop
  useEffect(() => {
    if (user) setLocalUser(user);
  }, [user]);

  const crimeTypes = useMemo(() => {
    if (!localUser) return ["all"];
    const types = Array.from(new Set(localUser.crimes.map((c) => c.type)));
    return ["all", ...types];
  }, [localUser]);

  const filteredCrimes = useMemo(() => {
    if (!localUser) return [];
    if (filterType === "all") return localUser.crimes;
    return localUser.crimes.filter((crime) => crime.type === filterType);
  }, [filterType, localUser]);

  const handleStatusToggle = async () => {
    if (!localUser) return;

    const newStatus = !localUser.isActive;
    setStatusLoading(true);

    try {
       await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/updateActiveStatus/${localUser._id}`,
        { isActive: newStatus },
        { withCredentials: true }
      );

      // Immediately update local state for snappy UI
      const updatedUser = { ...localUser, isActive: newStatus };
      setLocalUser(updatedUser);
      onStatusChange?.(updatedUser);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  // ✅ Only return null *after* all hooks
  if (!localUser) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-4">
        {/* USER INFO */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">{localUser.name}</p>
          <p className="text-sm text-gray-600">{localUser.email}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm">
              Account Status:{" "}
              <span
                className={
                  localUser.isActive ? "text-green-600" : "text-red-600"
                }
              >
                {localUser.isActive ? "Active" : "Inactive"}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm">
                {localUser.isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={localUser.isActive}
                onChange={handleStatusToggle}
                disabled={statusLoading}
                color="primary"
              />
            </div>
          </div>

          <p className="text-sm mt-1">
            Crimes Reported: <strong>{localUser.totalCrimesReported}</strong>
          </p>
        </div>

        {/* CRIME TYPE FILTER */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">Filter by Crime Type:</label>
          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {crimeTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {/* CRIME LIST */}
        <div>
          <h3 className="text-md font-semibold mb-2">Reported Crimes</h3>

          {filteredCrimes.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No crimes found for this filter.
            </p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {filteredCrimes.map((crime) => (
                <li
                  key={crime._id}
                  className="border rounded-lg p-3 shadow-sm bg-white"
                >
                  <p className="font-medium">{crime.title}</p>
                  <p className="text-sm text-gray-600">Type: {crime.type}</p>
                  <p className="text-sm mt-1">{crime.description}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    Date: {new Date(crime.datetime).toLocaleString()}
                  </p>

                  <p className="text-xs mt-1">
                    Status:{" "}
                    <span
                      className={
                        crime.isVerified ? "text-green-600" : "text-yellow-600"
                      }
                    >
                      {crime.isVerified ? "Verified" : "Pending"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
}
