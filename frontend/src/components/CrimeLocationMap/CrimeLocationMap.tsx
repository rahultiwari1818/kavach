"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createLeafletIcon } from "../Map/leafletHelpers";
import "leaflet/dist/leaflet.css";

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});


const markerIconOptions = {
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
};

export default function CrimeLocationMap({
  location,
  setLocation,
}: {
  location: { lat: number; lng: number };
  setLocation: (val: { lat: number; lng: number }) => void;
}) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const markerIcon = useMemo(
    () => createLeafletIcon(markerIconOptions),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Initialize selected location if not already set
          if (location.lat === 0 && location.lng === 0) {
            setLocation({ lat: latitude, lng: longitude });
          }
        },
        () => {
          // Fallback to a default (e.g., Delhi)
          const fallback: [number, number] = [28.6139, 77.209];
          setUserLocation(fallback);
          if (location.lat === 0 && location.lng === 0) {
            setLocation({ lat: fallback[0], lng: fallback[1] });
          }
        }
      );
    }
  }, [location.lat, location.lng, setLocation]);

  if (!userLocation) return <div>Loading map...</div>;

  const markers = location.lat
    ? [
        {
          id: "selected-location",
          position: [location.lat, location.lng] as [number, number],
          icon: markerIcon || undefined,
        },
      ]
    : [];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <MapComponent
        center={userLocation}
        zoom={14}
        markers={markers}
        // showUserLocation
        onMapClick={(lat: number, lng: number) => {
          setLocation({ lat, lng });
        }}
        height="50vh"
        userIcon={markerIcon}
      />
    </div>
  );
}
