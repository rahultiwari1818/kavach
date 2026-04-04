import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import { ReactNode } from "react"

export interface MapMarker {
  id: string
  position: LatLngExpression
  popupContent?: ReactNode
  icon?: any
}

export interface MapProps {
  center?: LatLngExpression
  zoom?: number
  showUserLocation?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
  className?: string
  markers?: MapMarker[]
  tileUrl?: string
  userIcon?: any
  height?: string
  children?: ReactNode
}


// export type Crime = {
//   _id: string;
//   title: string;
//   type: string;
//   description: string;
//   location: {
//     type: string;
//     coordinates: [number, number]; // [lng, lat]
//   };
//   datetime: string;
//   reportedBy: {
//     name: string;
//     _id: string;
//     email: string;
//   };
//   mediaUrl:Array<{url:string,_id:string,type:string}>;
//   verificationStatus:string;
//   verificationRemarks?:string;
// };

export const MarkerClusterGroup = dynamic(() => import("react-leaflet-markercluster"), { ssr: false });

