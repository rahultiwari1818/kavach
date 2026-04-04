"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Hotspot {
  lat: number;
  lng: number;
  count: number;
  color: string;
}

interface HotspotLayerProps {
  hotspots: Hotspot[];
}

export default function HotspotLayer({ hotspots }: HotspotLayerProps) {
  const map = useMap();

  useEffect(() => {
    const layers: L.Circle[] = [];

    hotspots.forEach((hotspot) => {
      const L = typeof window !== "undefined" ? require("leaflet") as typeof import("leaflet") : null;
      if (!L) return;

      const circle = L.circle([hotspot.lat, hotspot.lng], {
        color: hotspot.color,
        fillColor: hotspot.color,
        fillOpacity: 0.6,
        radius: 500, // 500m radius for each hotspot area
        weight: 1,
      }).addTo(map);

      // Add popup with info
      circle.bindPopup(`Crimes: ${hotspot.count}<br>Lat: ${hotspot.lat.toFixed(4)}<br>Lng: ${hotspot.lng.toFixed(4)}`);

      layers.push(circle);
    });

    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
    };
  }, [hotspots, map]);

  return null;
}