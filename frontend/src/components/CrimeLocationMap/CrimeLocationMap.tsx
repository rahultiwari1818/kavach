"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({
  setLocation,
}: {
  setLocation: (latlng: string) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation(`${lat},${lng}`);
    },
  });
  return null;
}

function MapAutoFocus({ location }: { location: string }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      const [lat, lng] = location.split(",").map(Number);
      map.setView([lat, lng], 15); // Zoom level 15 for street view
    }
  }, [location, map]);

  return null;
}

export default function CrimeLocationMap({
  location,
  setLocation,
}: {
  location: string;
  setLocation: (val: string) => void;
}) {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );

  useEffect(() => {
  if (typeof window !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(coords);
        setLocation(`${coords[0]},${coords[1]}`);
      },
      () => setUserLocation([20.5937, 78.9629])
    );
  }
}, [setLocation]);
  if (!userLocation) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={userLocation}
      zoom={5} // Initial zoom, will be overridden
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker setLocation={setLocation} />
      <MapAutoFocus location={location} />
      {location && (
        <Marker
          position={location.split(",").map(Number) as LatLngExpression}
          icon={markerIcon}
        />
      )}
    </MapContainer>
  );
}
