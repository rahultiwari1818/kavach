export interface LeafletIconOptions {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
}

export function getLeaflet() {
  if (typeof window === "undefined") return null;
  return require("leaflet") as typeof import("leaflet");
}

export function createLeafletIcon(options: LeafletIconOptions) {
  const L = getLeaflet();
  if (!L) return null;
  return new L.Icon(options);
}
