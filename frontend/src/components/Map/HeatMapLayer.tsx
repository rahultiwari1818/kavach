"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
      minOpacity: 1,
    //   gradient: { 0.4: "orange", 0.6: "red", 1.0: "darkred" },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
}
