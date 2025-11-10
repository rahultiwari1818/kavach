// app/admin/crimes/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Map from "@/components/Map/Map";
import { Icon } from "leaflet";
import GeneratePopUpContent from "@/components/Map/GeneratePopUpContent";
import { Crime } from "@/Types/crime";



const userIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});



export default function AdminCrimesPage() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnverifiedCrimes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/getAllUnverifiedCrimes`,
        {
          withCredentials: true,
        }
      );
      setCrimes(res.data.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  },[])


  useEffect(() => {
    fetchUnverifiedCrimes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin – Verify Crimes on Map</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Map
          markers={crimes.map((crime) => ({
            id: crime._id,
            position: [
              crime.location.coordinates[1],
              crime.location.coordinates[0],
            ],
            popupContent:<GeneratePopUpContent crime={crime} fetchUnverifiedCrimes={fetchUnverifiedCrimes}/>
          }))}
          zoom={13}
          tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          userIcon={userIcon}
          showUserLocation={true}
          
        />
      )}
    </div>
  );
}
