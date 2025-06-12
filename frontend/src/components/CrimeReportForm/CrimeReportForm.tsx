"use client";

import { ReactNode, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

type ChildProps = {
  onSubmit: (data: FormData) => void;
};

const CrimeLocationMap = dynamic(
  () => import("../CrimeLocationMap/CrimeLocationMap"),
  {
    ssr: false,
  }
);

export default function CrimeReportForm({ onSubmit }: ChildProps): ReactNode {
  const [data, setData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    datetime: "",
    anonymous: false,
  });
  const [media, setMedia] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement; // assert it is an input element
    const { name, value, type, checked } = target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMedia(Array.from(e.target.files));
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Append media files
    if (media) {
      // If media is a single file
      if (media instanceof File) {
        formData.append("media", media);
      } else if (Array.isArray(media)) {
        // If media is an array of files
        media.forEach((file) => {
          formData.append("media", file); // You can add index if needed: `media[${index}]`
        });
      }
    }
    onSubmit(formData);
  };

  //   const markerIcon = new Icon({
  //     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //   });

  //   function LocationPicker({
  //     setLocation,
  //   }: {
  //     setLocation: (latlng: string) => void;
  //   }) {
  //     useMapEvents({
  //       click(e) {
  //         const { lat, lng } = e.latlng;
  //         setLocation(`${lat},${lng}`);
  //       },
  //     });
  //     return null;
  //   }

//   const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
//     null
//   );

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
        //   setUserPosition([latitude, longitude]);
          setData((prev) => ({
            ...prev,
            location: `${latitude},${longitude}`,
          }));
          //   console.log(position.coords)
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmission}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">Report a Crime</h2>

      <div>
        <label className="block font-semibold mb-1" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={data.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="type">
          Crime Type
        </label>
        <select
          id="type"
          name="type"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={data.type}
          onChange={handleChange}
        >
          {[
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
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={data.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Select Crime Location on Map
        </label>
        <div className=" h-72 border border-gray-300">
          <CrimeLocationMap
            location={data.location}
            setLocation={(latlng) => {
              return setData((prev) => ({ ...prev, location: latlng }));
            }}
          />
        </div>
        <p className=" my-1 relative text-black z-10">
          Clicked coordinates: {data.location || "None"}
        </p>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="datetime">
          Date & Time of Incident
        </label>
        <input
          id="datetime"
          name="datetime"
          type="datetime-local"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={data.datetime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="mediaUrl">
          Media Evidence
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full mt-2"
          multiple
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="anonymous"
          name="anonymous"
          type="checkbox"
          checked={data.anonymous}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700">
          Submit anonymously
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Submit Report
      </button>
    </form>
  );
}
