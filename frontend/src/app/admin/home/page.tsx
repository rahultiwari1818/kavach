"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { Icon } from "leaflet";
import GeneratePopUpContent from "@/components/Map/GeneratePopUpContent";
import { Crime } from "@/Types/crime";
import Overlay from "@/components/Overlay/Overlay";
import { Slider } from "@mui/material";
import { debounce } from "@/utils/generalUtils"; // ✅ import your debounce function

const MapView = dynamic(() => import("@/components/Map/Map"), { ssr: false });

const userIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("7d");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [radius, setRadius] = useState(1000);
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);

  // ✅ Fetch user's location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
        },
        () => toast.warn("Unable to fetch location. Default view used.")
      );
    }
  }, []);

  // ✅ Debounced API call
  const fetchCrimes = useCallback(
    async (
      lat: number | string,
      lng: number | string,
      radius: number | string,
      type: number | string,
      time: number | string,
      status: number | string
    ) => {
      if (!lat || !lng) return;
      setLoading(true);

      try {
        const now = new Date();
        let fromDate: string | undefined;

        const calculateFromDate = (days: number) =>
          new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

        switch (time) {
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
            fromDate = undefined;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/getCrimes`, {
          params: {
            status,
            type: type !== "All" ? type : undefined,
            fromDate,
            lat,
            lng,
            radius,
          },
          withCredentials: true,
        });

        setCrimes(res.data.data || []);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response) toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ Wrap fetchCrimes with debounce once
  const debouncedFetchCrimes = useMemo(
    () =>
      debounce(
        (
          lat: number | string,
          lng: number | string,
          radius: number | string,
          type: number | string,
          time: number | string,
          status: number | string
        ) => fetchCrimes(lat, lng, radius, type, time, status),
        700 // ms delay
      ),
    [fetchCrimes]
  );

  // ✅ Trigger API when filters or radius change (debounced)
  useEffect(() => {
    if (userLocation[0] && userLocation[1]) {
      debouncedFetchCrimes(
        userLocation[0],
        userLocation[1],
        radius,
        selectedType,
        selectedTime,
        selectedStatus
      );
    }
  }, [selectedType, selectedTime, selectedStatus, radius, userLocation, debouncedFetchCrimes]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin – Crime Management Dashboard
      </h1>

      {/* === FILTER BAR === */}
      <div className="flex flex-wrap items-center justify-around gap-6 mb-6 bg-white shadow p-4 rounded-xl border border-gray-100">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crime Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crime Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Filter (Slider) */}
        <div className="flex flex-col text-sm lg:w-[40%] md:w-[50%] w-full">
          <label className="font-medium text-gray-700 mb-2 text-center lg:text-left">
            Search Radius: {radius.toLocaleString()} m
          </label>
          <Slider
            value={radius}
            onChange={(_, value) => setRadius(value as number)}
            min={100}
            max={50000}
            step={100}
            valueLabelDisplay="auto"
            sx={{
              color: "#2563eb",
              "& .MuiSlider-thumb": { borderRadius: "6px" },
            }}
          />
        </div>
      </div>

      {/* === MAP SECTION === */}
      {loading ? (
        <Overlay open={loading} />
      ) : (
        <MapView
          markers={crimes.map((crime) => ({
            id: crime._id,
            position: [
              crime.location.coordinates[1],
              crime.location.coordinates[0],
            ],
            popupContent: (
              <GeneratePopUpContent
                crime={crime}
                fetchUnverifiedCrimes={() =>
                  debouncedFetchCrimes(
                    userLocation[0],
                    userLocation[1],
                    radius,
                    selectedType,
                    selectedTime,
                    selectedStatus
                  )
                }
              />
            ),
          }))}
          zoom={15}
          showUserLocation={true}
          center={userLocation}
          tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          userIcon={userIcon}
          height="75vh"
          radius={radius}
        />
      )}
    </div>
  );
}
