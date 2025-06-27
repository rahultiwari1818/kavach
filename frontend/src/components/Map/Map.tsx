"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Location = {
  type: string;
  coordinates: [number, number]; // [lng, lat]
};

export type CrimeMarker = {
  _id: string;
  title: string;
  type: string;
  description: string;
  datetime: string;
  location: Location;
  isVerified?: boolean;
  reportedBy?: {
    name: string;
    email: string;
  };
};

type Props = {
  markers: CrimeMarker[];
  center?: [number, number]; // Optional: [lat, lng]
  zoom?: number;
  height?: string;
  showVerifyButton?: boolean;
  onVerifyClick?: (id: string) => void;
};

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

export default function CrimeMap({
  markers,
  center,
  zoom = 13,
  height = "80vh",
  showVerifyButton = false,
  onVerifyClick,
}: Props) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(center || null);

  useEffect(() => {
    if (!center && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // fallback to India if permission denied
          setUserLocation([23.2599, 77.4126]);
        }
      );
    }
  }, [center]);

  if (!userLocation) return <div>Loading map...</div>;

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer center={userLocation} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        <Marker position={userLocation} icon={greenMarker}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Crime markers */}
        {markers.map((crime) => {
          const [lng, lat] = crime.location.coordinates;
          const markerIcon = crime.isVerified ? greenMarker : redMarker;

          return (
            <Marker
              key={crime._id}
              position={[lat, lng]}
              icon={markerIcon}
            >
              <Popup>
                <strong>{crime.title}</strong><br />
                {crime.type}<br />
                {crime.description}<br />
                {new Date(crime.datetime).toLocaleString()}<br />
                {crime.reportedBy && (
                  <>
                    By: {crime.reportedBy.name}<br />
                    Email: {crime.reportedBy.email}<br />
                  </>
                )}
                {showVerifyButton && !crime.isVerified && onVerifyClick && (
                  <button
                    className="mt-2 px-3 py-1 text-sm rounded bg-green-600 text-white"
                    onClick={() => onVerifyClick(crime._id)}
                  >
                    Mark as Verified
                  </button>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
