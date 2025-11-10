"use client";

import dynamic from "next/dynamic";

const CrimeMap = dynamic(() => import("@/components/CrimeMap/CrimeMap"), {
  ssr: false,
});

export default function CrimeNearbyPage() {
  return (
    <div>
      {/* <h1 className="text-xl font-bold p-2">Crimes Near You</h1> */}
      <CrimeMap />
    </div>
  );
}
