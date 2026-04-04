"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import GeneratePopUpContent from "@/components/Map/GeneratePopUpContent";
import { createLeafletIcon } from "@/components/Map/leafletHelpers";
import { Crime } from "@/Types/crime";
import Overlay from "@/components/Overlay/Overlay";
import MapView from "@/components/Map/Map";
import dynamic from "next/dynamic";
import { CRIME_TYPES, TIME_OPTIONS, userIconOptions } from "@/constants/crimeConstants";

const DynamicMapView = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

interface VerifiedCrimeDashboardProps {
  role: "admin" | "super-admin";
  useDynamicMap?: boolean;
}

export default function VerifiedCrimeDashboard({
  role,
  useDynamicMap = false,
}: VerifiedCrimeDashboardProps) {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTime, setSelectedTime] = useState<string>("7d");
  const userIcon = useMemo(() => createLeafletIcon(userIconOptions), []);

  const fetchVerifiedCrimes = async () => {
    try {
      const now = new Date();
      let fromDate: string | undefined;

      const calculateFromDate = (days: number) =>
        new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

      switch (selectedTime) {
        case "24h":
          fromDate = calculateFromDate(1);
          break;
        case "7d":
          fromDate = calculateFromDate(7);
          break;
        case "30d":
          fromDate = calculateFromDate(30);
          break;
        case "60d":
          fromDate = calculateFromDate(60);
          break;
        case "quarter":
          fromDate = calculateFromDate(90);
          break;
        case "half":
          fromDate = calculateFromDate(182);
          break;
        case "1y":
          fromDate = calculateFromDate(365);
          break;
        default:
          fromDate = "all";
      }

      const params: Record<string, string> = {};
      if (selectedType !== "All") params.type = selectedType;
      if (selectedTime !== "All" && fromDate) params.fromDate = fromDate;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/getAllverifiedCrimes`,
        { params, withCredentials: true }
      );
      setCrimes(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedCrimes();
  }, [selectedType, selectedTime]);

  const MapComponent = useDynamicMap ? DynamicMapView : MapView;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {role === "admin" ? "Admin" : "Super Admin"} – Verified Crimes on Map
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crime Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            {CRIME_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map */}
      {loading ? (
        <Overlay open={loading} />
      ) : (
        <MapComponent
          markers={crimes.map((crime) => ({
            id: crime._id,
            position: [
              crime.location.coordinates[1],
              crime.location.coordinates[0],
            ],
            popupContent: <GeneratePopUpContent crime={crime} />,
          }))}
          zoom={13}
          showUserLocation={true}
          tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          userIcon={userIcon}
        />
      )}
    </div>
  );
}
