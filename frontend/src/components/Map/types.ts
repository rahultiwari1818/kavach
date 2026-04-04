import type { LatLngExpression } from "leaflet";
import { JSX } from "react";

export interface MapMarker {
  id: string;
  position: LatLngExpression;
  popupContent?: JSX.Element;
  icon?: any;
}



export interface Hotspot {
  lat: number;
  lng: number;
  count: number;
  color: string;
}

export interface CustomMapProps {
  center?: LatLngExpression;
  zoom?: number;
  markers?: MapMarker[];
  tileUrl?: string;
  height?: string;
  width?: string;
  scrollWheelZoom?: boolean;
  draggable?: boolean;
  showZoomControl?: boolean;
  showUserLocation?: boolean;
  userIcon?: Icon;
  onMapClick?: (lat: number, lng: number) => void;
  heatPoints?:Array<[number,number,number]>;
  crimeCount?:number;
  radius?:number;
  hotspots?: Hotspot[];
  userIcon?: any;
}
