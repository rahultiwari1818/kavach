"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Icon } from "leaflet";
import Slider from "@mui/material/Slider";
import { MapMarker } from "@/components/Map/types";
import CustomMap from "@/components/Map/Map";
import GeneratePopUpContent from "../Map/GeneratePopUpContent";
import { debounce } from "@/utils/generalUtils";
import { Crime } from "@/Types/crime";
import Overlay from "../Overlay/Overlay";

const userIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const crimeIcon = new Icon({
  iconUrl: "/red-marker.png",
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

// { role }: { role?: string }
export default function CrimeMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [crimeCount, setCrimeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(1000);
  const [zoom, setZoom] = useState(15);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTime, setSelectedTime] = useState("7d");

  useEffect(() => {
    const newZoom = Math.max(8, 20 - Math.log10(radius));
    setZoom(Math.round(newZoom));
  }, [radius]);

  const debouncedFetch = useMemo(
    () =>
      debounce(
        async (
          lat: number | string,
          lng: number | string ,
          radius: number | string,
          type: number | string,
          time: number | string
        ) => {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/nearby`,
              {
                params: { lat, lng, radius, type, time },
                withCredentials: true,
              }
            );
            const crimes = res.data.data || [];
            setCrimeCount(crimes.length);

            const crimeMarkers: MapMarker[] = crimes.map((crime: Crime) => {
              const [lng, lat] = crime.location.coordinates;
              return {
                id: crime._id,
                position: [lat, lng],
                popupContent: <GeneratePopUpContent crime={crime} />,
                icon: crimeIcon,
              };
            });

            setMarkers(crimeMarkers);
          } catch (err) {
            console.error("Error fetching nearby crimes", err);
          } finally {
            setLoading(false);
          }
        },
        500
      ),
    []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        debouncedFetch(latitude, longitude, radius, selectedType, selectedTime);
      },
      (err) => {
        console.error("Geolocation error", err);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      debouncedFetch(
        userLocation[0],
        userLocation[1],
        radius,
        selectedType,
        selectedTime
      );
    }
  }, [radius, selectedType, selectedTime]);

  // if (loading || !userLocation) return <div>Loading map...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Filter Panel */}
      <div className="w-full  mt-6 bg-white/70 backdrop-blur-md rounded-xl shadow-md px-6 py-2">
        <h2 className="text-xl md:text-xl font-bold text-center text-gray-800 mb-2">
          Nearby Crimes — {crimeCount} Found
        </h2>

        {/* Responsive Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
          {/* Crime Type */}
          <div className="flex flex-col text-sm">
            <label className="font-medium text-gray-700 mb-1">Crime Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CRIME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="flex flex-col text-sm">
            <label className="font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Slider */}
          <div className="flex flex-col text-sm">
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
      </div>

      {/* Map Section */}
      <div className="w-full mt-6">
        {loading ? (
          <Overlay open={loading} />
        ) : (
          <CustomMap
            showUserLocation
            zoom={zoom}
            markers={markers}
            height="75vh"
            userIcon={userIcon}
            tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            crimeCount={crimeCount}
            radius={radius}
          />
        )}
      </div>
    </div>
  );
}
