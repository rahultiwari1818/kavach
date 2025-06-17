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
  setLocation: (latlng: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
}

function FlyToOnce({ location }: { location: { lat: number; lng: number } }) {
  const map = useMap();
  const [hasFlown, setHasFlown] = useState(false);

  useEffect(() => {
    if (!hasFlown && location) {
      map.flyTo([location.lat, location.lng], 15);
      setHasFlown(true);
    }
  }, [location, hasFlown, map]);

  return null;
}

export default function CrimeLocationMap({
  location,
  setLocation,
}: {
  location: { lat: number; lng: number };
  setLocation: (val: { lat: number; lng: number }) => void;
}) {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null
  );

useEffect(() => {
  if (typeof window !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords: LatLngExpression = [lat, lng];
        setUserLocation(coords);
        console.log(position+" po")
        // Only update if location is invalid/default
        if (location.lat === 0 && location.lng === 0) {
          setLocation({ lat, lng });
        }
      },
      () => {
        const fallback: LatLngExpression = [28.6437, 77.2129];
        setUserLocation(fallback);

        if (location.lat === 0 && location.lng === 0) {
          setLocation({ lat: fallback[0], lng: fallback[1] });
        }
      }
    );
  }
}, [location.lat, location.lng, setLocation]);


  if (!userLocation) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={location || userLocation}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToOnce location={location} />
      <LocationPicker setLocation={setLocation} />
      {location && <Marker position={location} icon={markerIcon} />}
    </MapContainer>
  );
}
