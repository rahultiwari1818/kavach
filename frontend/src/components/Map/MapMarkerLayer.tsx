"use client";
import { Marker, Popup } from "react-leaflet";
import { MapMarker } from "./types";

interface Props {
  markers: MapMarker[];
}

export default function MapMarkerLayer({ markers }: Props) {
  return (
    <>
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={marker.icon}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}
    </>
  );
}
