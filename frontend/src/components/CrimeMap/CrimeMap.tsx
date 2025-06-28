"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Crime = {
  _id: string;
  title: string;
  type: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  datetime: string;
  reportedBy: {
    name: string;
    _id: string;
    email: string;
  };
};

export default function CrimeMap() {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/nearby`,
              {
                params: {
                  lat: latitude,
                  lng: longitude,
                  radius: 3000,
                },
                withCredentials: true,
              }
            );
            setCrimes(res.data.data || []);
          } catch (err) {
            console.error("Error fetching nearby crimes", err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error", err);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLoading(false);
    }
  }, [mounted]);

  if (!mounted || loading || !userLocation) return <div>Loading map...</div>;

  return (
    <div className="w-full h-[80vh]">
      <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation} icon={markerIcon}>
          <Popup>Your Location</Popup>
        </Marker>
        {crimes?.map((crime) => {
          const coords = crime.location?.coordinates;
          if (!Array.isArray(coords) || coords.length < 2) return null;

          const [lng, lat] = coords;
          if (typeof lat !== "number" || typeof lng !== "number") return null;
          return (
            <Marker key={crime._id} position={[lat, lng]} icon={redIcon}>
              <Popup>
                <strong>{crime.title}</strong>
                <br />
                Type: {crime.type}
                <br />
                {crime.description}
                <br />
                Reported: {new Date(crime.datetime).toLocaleString()}
                <br />
                Reported By: {crime.reportedBy?.name}
                <br />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
