"use client";
import { Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import { MapMarker } from "./types";
import { createLeafletIcon } from "./leafletHelpers";

interface Props {
  markers: MapMarker[];
}

const defaultUserIconOptions = {
  iconUrl: "/greenMarker.png",
  iconSize: [30, 40] as [number, number],
  iconAnchor: [15, 40] as [number, number],
};

export default function MapMarkerLayer({ markers }: Props) {
  const defaultUserIcon = useMemo(
    () => createLeafletIcon(defaultUserIconOptions),
    []
  );
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={marker.icon ?? defaultUserIcon}
        >
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}
    </>
  );
}
