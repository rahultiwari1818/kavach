"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import {  Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

type Crime = {
  _id: string;
  title: string;
  type: string;
  description: string;
  datetime: string;
  isVerified: boolean;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
};

// Define two marker icons
const redMarker = new Icon({
  iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=warning|FF0000",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const greenMarker = new Icon({
  iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=check|00FF00",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

export default function AdminCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  // const [center, setCenter] = useState<LatLngExpression> ([23.2599, 77.4126]); // Default center (India)

  const fetchUnverifiedCrimes = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/getAllUnverifiedCrimes`, {
        withCredentials: true,
      });
      setCrimes(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
               if (error.response) console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (crimeId: string, status: boolean) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/verify`,
        { crimeId, status },
        { withCredentials: true }
      );
      toast.success(`Marked as ${status ? "Verified" : "Unverified"}`);
      fetchUnverifiedCrimes();
    } catch (err) {
       const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
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
      ) : crimes.length === 0 ? (
        <p>No unverified crimes found.</p>
      ) : (
        <div className="w-full h-[80vh] mb-8">
          <MapContainer center={[23.2599, 77.4126]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {crimes.map((crime) => (
              <Marker
                key={crime._id}
                position={[crime.location.coordinates[1], crime.location.coordinates[0]]}
                icon={crime.isVerified ? greenMarker : redMarker}
              >
                <Popup>
                  <strong>{crime.title}</strong><br />
                  <span>{crime.type}</span><br />
                  <span>{crime.description}</span><br />
                  <span>Reported: {new Date(crime.datetime).toLocaleString()}</span><br />
                  <span>By: {crime.reportedBy?.name || "Anonymous"}</span><br />
                  {!crime.isVerified && (
                    <button
                      className="mt-2 px-3 py-1 text-sm rounded bg-green-600 text-white"
                      onClick={() => handleVerification(crime._id, true)}
                    >
                      Mark as Verified
                    </button>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
