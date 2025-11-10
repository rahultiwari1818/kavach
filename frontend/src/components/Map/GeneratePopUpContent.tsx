"use client";

import {  useState } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Crime } from "@/Types/crime";

interface GeneratePopUpContentProps {
  crime: Crime;
  fetchUnverifiedCrimes?: () => void;
}

export default function GeneratePopUpContent({
  crime,
  fetchUnverifiedCrimes,
}: GeneratePopUpContentProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationRemark, setVerificationRemark] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // 🔹 Handle verify/reject


    const handleVerification = async (action: string,remarks:string) => {
      try {
              setIsVerifying(true);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/${crime._id}/verify`,
          { status: action ,remarks:remarks},
          { withCredentials: true }
        );
        toast.success("Crime marked as verified");
        fetchUnverifiedCrimes();
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.log(error);
        toast.error("Verification failed.");
      }
      finally{
        setIsVerifying(false)
      }
    };
  

  return (
    <div className="max-w-[240px] text-sm font-sans text-gray-800">
      <h3 className="text-base font-semibold text-blue-700 mb-1">{crime.title}</h3>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Type:</span> {crime.type}
      </p>
      <p className="text-gray-700 mb-2">{crime.description}</p>

      <p className="text-gray-500 text-xs mb-1">
        <b>Reported:</b> {new Date(crime.datetime).toLocaleString()}
      </p>
      <p className="text-gray-500 text-xs mb-2">
        <b>By:</b> {crime.reportedBy?.name || "Anonymous"}
      </p>

      {/* 🔹 Verification Section */}
      {crime.verificationStatus === "pending" && ( 
        <div className="border-t border-gray-200 pt-2 mt-2">
          <p className="text-sm font-medium mb-1 text-gray-700">Verification</p>

          <textarea
            placeholder="Add remarks"
            value={verificationRemark}
            onChange={(e) => setVerificationRemark(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
          />

          <div className="flex justify-between gap-2">
            <button
              onClick={() => handleVerification("verify",verificationRemark)}
              disabled={isVerifying}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-1 rounded transition"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
            <button
              onClick={() => handleVerification("reject",verificationRemark)}
              disabled={isVerifying}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-2 py-1 rounded transition"
            >
              {isVerifying ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Media Section */}
      {crime.mediaUrl && crime.mediaUrl.length > 0 && (
        <div className="mt-3 border-t border-gray-200 pt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Media ({crime.mediaUrl.length})
          </p>

          <div className="grid grid-cols-3 gap-2">
            {crime.mediaUrl.map((media) =>
              media.type === "image" ? (
                <div
                  key={media._id}
                  className="relative cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedMedia(media.url)}
                >
                  <Image
                    src={media.url}
                    alt={crime.title || "Crime media"}
                    sizes="10"
                    fill
                    className="object-cover rounded-md border"
                  />
                </div>
              ) : (
                <video
                  key={media._id}
                  controls
                  className="rounded-md border w-full col-span-3"
                >
                  <source src={media.url} type="video/mp4" />
                </video>
              )
            )}
          </div>
        </div>
      )}

      {/* 🔹 Lightbox Modal for Images */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative w-[90vw] md:w-[60vw] h-[80vh]">
            <Image
              src={selectedMedia}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
            <button
              className="absolute top-3 right-3 bg-white text-black px-3 py-1 rounded-md text-xs font-semibold shadow"
              onClick={() => setSelectedMedia(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
