import { LatLngExpression, Icon } from "leaflet";
import { JSX } from "react";

export interface MapMarker {
  id: string;
  position: LatLngExpression;
  popupContent?: JSX.Element;
  icon?: Icon;
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
}
