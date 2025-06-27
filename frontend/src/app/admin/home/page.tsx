// app/admin/crimes/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const MapView = dynamic(() => import("@/components/Map/Map"), { ssr: false });

type Crime = {
  _id: string;
  title: string;
  type: string;
  description: string;
  datetime: string;
  isVerified: boolean;
  location: {
    type: string;
    coordinates: [number, number];
  };
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function AdminCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnverifiedCrimes = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/getAllUnverifiedCrimes`,
        {
          withCredentials: true,
        }
      );
      setCrimes(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (crimeId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/verify`,
        { crimeId, status: true },
        { withCredentials: true }
      );
      toast.success("Crime marked as verified");
      fetchUnverifiedCrimes();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      toast.error("Verification failed.");
    }
  };

  useEffect(() => {
    fetchUnverifiedCrimes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin – Verify Crimes on Map</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MapView
          markers={crimes}
          showVerifyButton
          onVerifyClick={handleVerification}
        />
      )}
    </div>
  );
}
