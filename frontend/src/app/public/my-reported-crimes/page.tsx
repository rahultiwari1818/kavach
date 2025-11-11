"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Crime } from "@/Types/crime";
import CrimeDetailsDialog from "@/components/CrimeDetailsDialog/CrimeDetailsDialog"; // Assuming this file path

export default function MyReportedCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null); // For storing the selected crime
  const [dialogOpen, setDialogOpen] = useState(false); // To manage dialog visibility

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/my-reports`,
        { withCredentials: true }
      );
      setCrimes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching my crimes:", err);
      toast.error("Failed to load your reported crimes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleOpenDialog = (crime: Crime) => {
    setSelectedCrime(crime);  // Set selected crime
    setDialogOpen(true);      // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);  // Close the dialog
    setSelectedCrime(null); // Reset selected crime
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Loading your reports...
      </div>
    );

  if (crimes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>You haven’t reported any crimes yet.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        My Reported Crimes
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-center">Date & Time</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {crimes.map((crime) => (
              <tr key={crime._id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3 font-medium text-gray-800">{crime.title}</td>
                <td className="p-3 capitalize">{crime.type}</td>
                <td className="p-3 text-gray-600 line-clamp-2">{crime.description}</td>
                <td className="p-3 text-center text-sm text-gray-500">
                  {new Date(crime.datetime).toLocaleString()}
                </td>
                <td className="p-3 text-center font-semibold">
                  {crime.verificationStatus === "verified" ? (
                    <span className="text-green-600">Verified</span>
                  ) : crime.verificationStatus === "pending" ? (
                    <span className="text-yellow-600">Pending</span>
                  ) : (
                    <span className="text-red-600">Rejected</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleOpenDialog(crime)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog to show Crime Details */}
      {selectedCrime && (
        <CrimeDetailsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          crime={selectedCrime}
        />
      )}
    </div>
  );
}
