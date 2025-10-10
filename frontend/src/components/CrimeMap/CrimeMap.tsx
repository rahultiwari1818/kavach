"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "leaflet";
import dynamic from "next/dynamic";
import { MapMarker } from "@/components/map/types";
import CustomMap from "@/components/Map/Map";
import { Crime } from "./types";

// Optional: dynamic import for SSR safety if needed
const MarkerClusterGroup = dynamic(() => import("react-leaflet-markercluster"), { ssr: false });

const userIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const crimeIcon = new Icon({
  iconUrl: "/redMarker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});



export default function CrimeMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLoading(false);
      return;
    }

    console.log(navigator.geolocation)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/nearby`, {
            params: { lat: latitude, lng: longitude, radius: 3000 },
            withCredentials: true,
          });

          const crimes = res.data.data || [];

          const crimeMarkers: MapMarker[] = crimes.map((crime: Crime) => {
            const [lng, lat] = crime.location.coordinates;
            return {
              id: crime._id,
              position: [lat, lng],
              popupContent: (
                <div>
                  <strong>{crime.title}</strong>
                  <br />
                  <span>Type: {crime.type}</span>
                  <br />
                  <span>{crime.description}</span>
                  <br />
                  <span>Reported: {new Date(crime.datetime).toLocaleString()}</span>
                  <br />
                  <span>By: {crime.reportedBy?.name}</span>
                </div>
              ),
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
      (err) => {
        console.error("Geolocation error", err);
        setLoading(false);
      }
    );
  }, []);

  if (loading || !userLocation) return <div>Loading map...</div>;

  return (
    <CustomMap
      showUserLocation={true}
      center={userLocation}
      zoom={13}
      markers={markers}
      height="80vh"
      userIcon={userIcon}
      tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}
