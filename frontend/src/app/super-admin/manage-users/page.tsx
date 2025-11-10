"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDetailsDialog from "@/components/UserDetailsDialog/UserDetailsDialog";

interface Crime {
  _id: string;
  isVerified: boolean;
  title?: string;
  type?: string;
  description?: string;
  datetime?: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalCrimesReported: number;
  crimes: Crime[];
}

export default function Page() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData>({_id:"",name:"",email:"",isActive:false,totalCrimesReported:0,crimes:[]});

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/get-all-users`,
        { withCredentials: true }
      );
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        All Public Users & Crime Statistics
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-3 text-sm sm:text-base">Name</th>
                <th className="text-left p-3 text-sm sm:text-base">Email</th>
                <th className="text-center p-3 text-sm sm:text-base">
                  Total Crimes
                </th>
                <th className="text-center p-3 text-sm sm:text-base">
                  Verified
                </th>
                <th className="text-center p-3 text-sm sm:text-base">
                  Unverified
                </th>
                <th className="text-center p-3 text-sm sm:text-base">Status</th>
                <th className="text-center p-3 text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const verifiedCount = user.crimes.filter(
                  (c) => c.isVerified
                ).length;

                const unverifiedCount =
                  user.totalCrimesReported - verifiedCount;

                return (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-sm sm:text-base break-words max-w-[200px]">
                      {user.name}
                    </td>
                    <td className="p-3 text-sm sm:text-base break-words max-w-[250px]">
                      {user.email}
                    </td>
                    <td className="p-3 text-center font-medium text-sm sm:text-base">
                      {user.totalCrimesReported}
                    </td>
                    <td className="p-3 text-center text-green-600 font-medium text-sm sm:text-base">
                      {verifiedCount}
                    </td>
                    <td className="p-3 text-center text-red-500 font-medium text-sm sm:text-base">
                      {unverifiedCount}
                    </td>
                    <td
                      className={`p-3 text-center ${
                        user?.isActive === undefined || user.isActive
                          ? "text-green-600"
                          : "text-red-500"
                      } font-medium text-sm sm:text-base`}
                    >
                      {user?.isActive === undefined || user.isActive
                        ? "Active"
                        : "In-Active"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => openDetails(user)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs sm:text-sm hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* USER DETAILS DIALOG */}
      <UserDetailsDialog
        key={selectedUser?._id || "no-user"} // 👈 forces re-render when user changes
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onStatusChange={(updatedUser) => {
          setUsers((prev) =>
            prev.map((u) =>
              u._id === updatedUser._id
                ? { ...u, isActive: updatedUser.isActive }
                : u
            )
          );
        }}
      />
    </div>
  );
}
