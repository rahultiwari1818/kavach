"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { CustomMapProps } from "./types";
import MapMarkerLayer from "./MapMarkerLayer";
import MapClickHandler from "./MapClickHandler";
import { Icon } from "leaflet";

const defaultUserIcon = new Icon({
  iconUrl: "/user-location.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

function MapComponent({
  center = [20.5937, 78.9629], // India by default
  zoom = 6,
  markers = [],
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  height = "80vh",
  width = "100%",
  scrollWheelZoom = true,
  draggable = true,
  showZoomControl = true,
  showUserLocation = false,
  userIcon = defaultUserIcon,
  onMapClick,
}: CustomMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (showUserLocation && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        () => {
          console.warn("Geolocation access denied or unavailable");
          setMapCenter(center);
        }
      );
    } else {
      setMapCenter(center);
    }
  }, [showUserLocation, center]);

  if (!mapCenter) return <div>Loading map...</div>;

  return (
    <div style={{ height, width }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        dragging={draggable}
        zoomControl={showZoomControl}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url={tileUrl} />
        <MapMarkerLayer markers={markers} />
        <MapClickHandler onClick={onMapClick} />

        {showUserLocation && userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
