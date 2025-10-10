import { LatLngExpression, Icon } from "leaflet"
import { ReactNode } from "react"

export interface MapMarker {
  id: string
  position: LatLngExpression
  popupContent?: ReactNode
  icon?: Icon
}

export interface MapProps {
  center?: LatLngExpression
  zoom?: number
  showUserLocation?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
  className?: string
  markers?: MapMarker[]
  tileUrl?: string
  userIcon?: Icon
  height?: string
  children?: ReactNode
}


export type Crime = {
  _id: string;
  title: string;
  type: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  datetime: string;
  reportedBy: {
    name: string;
    _id: string;
    email: string;
  };
};