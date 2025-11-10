"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Crime } from "@/Types/crime";

// interface Media {
//   _id: string;
//   url: string;
//   type: string; // "image" | "video"
// }

// interface Crime {
//   _id: string;
//   title: string;
//   type: string;
//   description: string;
//   datetime: string;
//   verificationStatus:string;
//   mediaUrl: Media[];
//   location: {
//     type: string;
//     coordinates: [number, number];
//   };
//   verificationRemarks?:string;
// }

export default function MyReportedCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

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
              <th className="p-3 text-center">Media</th>
            </tr>
          </thead>
          <tbody>
            {crimes.map((crime) => (
              <tr
                key={crime._id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="p-3 font-medium text-gray-800">{crime.title}</td>
                <td className="p-3 capitalize">{crime.type}</td>
                <td className="p-3 text-gray-600 line-clamp-2">
                  {crime.description}
                </td>
                <td className="p-3 text-center text-sm text-gray-500">
                  {new Date(crime.datetime).toLocaleString()}
                </td>
                <td className="p-3 text-center font-semibold">
                  {crime.verificationStatus === "verified" ? (
                    <span className="text-green-600">Verified</span>
                  ) :
                  crime.verificationStatus === "pending"
                  ?
                  (
                    <span className="text-yellow-600">Pending</span>
                  )
                  :
                  (
                    <span className="text-red-600">Rejected</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {crime.mediaUrl && crime.mediaUrl.length > 0 ? (
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 hover:underline">
                        View ({crime.mediaUrl.length})
                      </summary>
                      <div className="mt-2 flex flex-col items-center gap-2">
                        {crime.mediaUrl.map((media) =>
                          media.type === "image" ? (
                            <img
                              key={media._id}
                              src={media.url}
                              alt="crime-media"
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                          ) : (
                            <video
                              key={media._id}
                              controls
                              className="w-32 h-32 rounded-lg border"
                            >
                              <source src={media.url} type="video/mp4" />
                            </video>
                          )
                        )}
                      </div>
                    </details>
                  ) : (
                    <span className="text-gray-400">No Media</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
