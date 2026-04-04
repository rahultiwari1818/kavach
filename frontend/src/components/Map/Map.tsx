"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import { CustomMapProps } from "./types";
import MapMarkerLayer from "./MapMarkerLayer";
import MapClickHandler from "./MapClickHandler";
import { createLeafletIcon } from "./leafletHelpers";
// import HeatmapLayer from "./HeatMapLayer";
import RiskZoneLayer from "./RiskZoneLayer";
import HotspotLayer from "./HotspotLayer";
import HeatmapLayer from "./HeatMapLayer";

const defaultUserIconOptions = {
  iconUrl: "/user-location.png",
  iconSize: [30, 40] as [number, number],
  iconAnchor: [15, 40] as [number, number],
};

function FlyToLocation({ location ,zoom}: { location: [number, number] | null,zoom:number }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, zoom, { duration: 1.5 });
    }
  }, [location, map,zoom]);

  return null;
}

function MapComponent({
  center = [20.5937, 78.9629], // Default India center
  zoom = 15,
  markers = [],
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  height = "80vh",
  width = "100%",
  scrollWheelZoom = true,
  draggable = true,
  showZoomControl = true,
  showUserLocation = false,
  userIcon,
  onMapClick,
  heatPoints=[[0,0,0]],
  crimeCount=0,
  radius=1000,
  hotspots=[]
}: CustomMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (
      showUserLocation &&
      typeof window !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
        }
      );
    }
  }, [showUserLocation]);

  const resolvedUserIcon = useMemo(
    () => userIcon ?? createLeafletIcon(defaultUserIconOptions),
    [userIcon]
  );

  const initialCenter = userLocation || center;

  return (
    <div style={{ height, width }}>
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        dragging={draggable}
        zoomControl={showZoomControl}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url={tileUrl} />

        {/* Crime Markers */}
        <MapMarkerLayer markers={markers || []} />

        {/* Handle Map Click */}
        <MapClickHandler onClick={onMapClick} />

        {/* Auto-fly to user location when detected */}
        <FlyToLocation location={userLocation} zoom={zoom} />

        {/* User Location Marker */}
        {showUserLocation && userLocation && (
          <Marker position={userLocation} icon={resolvedUserIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

      {heatPoints && heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
        {(crimeCount || crimeCount >=0)  &&   <RiskZoneLayer userLocation={userLocation} crimeCount={crimeCount} radius={radius}/>}
        {hotspots && hotspots.length > 0 && <HotspotLayer hotspots={hotspots} />}
      </MapContainer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
