"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RiskZoneLayerProps {
  userLocation: [number, number] | null;
  crimeCount: number;
  radius:number;
}

export default function RiskZoneLayer({ userLocation, crimeCount,radius }: RiskZoneLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;
    let color = "";
    if (crimeCount >= 10) color = "red";
    else if (crimeCount >= 5) color = "yellow";
    else if (crimeCount >= 0) color = "green";
    const circle = L.circle(userLocation, {
      color,
      fillColor: color,
      fillOpacity: 0.4,
      radius: radius, // 1 km
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [userLocation, crimeCount, map,radius]);

  return null;
}
