"use client";
import { Marker, Popup } from "react-leaflet";
import { MapMarker } from "./types";

interface Props {
  markers: MapMarker[];
}
import { Icon } from "leaflet";

const defaultUserIcon = new Icon({
  iconUrl: "/greenMarker.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});


export default function MapMarkerLayer({ markers }: Props) {
  return (
    <>
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={marker.icon || defaultUserIcon}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}
    </>
  );
}
