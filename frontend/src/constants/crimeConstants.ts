// Shared constants for crime management dashboard
export const userIconOptions = {
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
};

export const CRIME_TYPES = [
  "All",
  "theft",
  "assault",
  "fraud",
  "murder",
  "vandalism",
  "cybercrime",
  "domestic violence",
  "drug-related",
  "kidnapping",
  "sexual harassment",
  "homicide",
  "burglary",
  "vehicle theft",
  "arson",
  "terrorism",
  "human trafficking",
  "illegal possession",
  "public disturbance",
  "corruption",
  "other",
];

export const TIME_OPTIONS = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "60d", label: "Last 60 Days" },
  { value: "quarter", label: "Last Quarter (3 Months)" },
  { value: "half", label: "Last Half-Year (6 Months)" },
  { value: "1y", label: "Last 1 Year" },
  { value: "All", label: "All Time" },
];

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];
