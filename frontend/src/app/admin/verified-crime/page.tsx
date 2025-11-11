"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { Icon } from "leaflet";
import GeneratePopUpContent from "@/components/Map/GeneratePopUpContent";
import { Crime } from "@/Types/crime";
import Overlay from "@/components/Overlay/Overlay";

const MapView = dynamic(() => import("@/components/Map/Map"), { ssr: false });



const userIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔹 Enum of crime types
const CRIME_TYPES = [
  "All",
  "theft",
  "assault",
  "fraud",
  "murder",
  "vandalism",
  "cybercrime",
  "domestic violence",
  "drug-related",
  "kidnapping",
  "sexual harassment",
  "homicide",
  "burglary",
  "vehicle theft",
  "arson",
  "terrorism",
  "human trafficking",
  "illegal possession",
  "public disturbance",
  "corruption",
  "other",
];

// 🔹 Time filter options
const TIME_OPTIONS = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "60d", label: "Last 60 Days" },
  { value: "quarter", label: "Last Quarter (3 Months)" },
  { value: "half", label: "Last Half-Year (6 Months)" },
  { value: "1y", label: "Last 1 Year" },
  { value: "All", label: "All Time" },
];

export default function AdminCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTime, setSelectedTime] = useState<string>("7d"); // default: past week

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
          fromDate = "all"; // "All"
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin – Verified Crimes on Map
      </h1>

      {/* 🧩 Filters */}
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

      {/* 🗺️ Map */}
      {loading ? (
        <Overlay open={loading}/>
      ) : (
        <MapView
          markers={crimes.map((crime) => ({
            id: crime._id,
            position: [
              crime.location.coordinates[1],
              crime.location.coordinates[0],
            ],
            popupContent: (
              <GeneratePopUpContent crime={crime} />
            ),
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
