"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RiskZoneLayerProps {
  userLocation: [number, number] | null;
  crimeCount: number;
  radius: number;
}

export default function RiskZoneLayer({
  userLocation,
  crimeCount,
  radius,
}: RiskZoneLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    const getColorForRisk = (count: number, radius: number): string => {
      if (radius <= 500) {
        if (count >= 6) return "red";
        if (count >= 3) return "yellow";
        return "green";
      } else if (radius <= 1000) {
        if (count >= 10) return "red";
        if (count >= 5) return "yellow";
        return "green";
      } else if (radius <= 3000) {
        if (count >= 15) return "red";
        if (count >= 8) return "yellow";
        return "green";
      } else if (radius <= 7000) {
        if (count >= 21) return "red";
        if (count >= 11) return "yellow";
        return "green";
      } else if (radius <= 15000) {
        if (count >= 41) return "red";
        if (count >= 21) return "yellow";
        return "green";
      } else {
        if (count >= 101) return "red";
        if (count >= 51) return "yellow";
        return "green";
      }
    };

    const color = getColorForRisk(crimeCount, radius);

    const circle = L.circle(userLocation, {
      color,
      fillColor: color,
      fillOpacity: 0.35,
      radius,
      weight: 1.5,
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [userLocation, crimeCount, map, radius]);

  return null;
}
