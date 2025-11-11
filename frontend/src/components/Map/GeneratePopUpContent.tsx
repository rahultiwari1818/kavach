"use client";

import { useState } from "react";
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

  // 🔹 Handle verify/reject
  const handleVerification = async (action: string, remarks: string) => {
    try {
      setIsVerifying(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/${crime._id}/verify`,
        { status: action, remarks: remarks },
        { withCredentials: true }
      );
      toast.success("Crime marked as verified");
      fetchUnverifiedCrimes?.();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      toast.error("Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 🔹 Handle media navigation
  const handleMediaChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentMediaIndex((prevIndex) =>
        prevIndex === 0 ? crime?.mediaUrl?.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentMediaIndex((nextIndex) =>
        nextIndex === crime?.mediaUrl?.length - 1 ? 0 : nextIndex + 1
      );
    }
  };

  return (
    <div className="max-w-[300px] text-sm font-sans text-gray-800">
      {/* Crime Details */}
      <h3 className="text-base font-semibold text-blue-700 mb-2">{crime.title}</h3>
      <p className="text-gray-600 mb-2">
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
        <div className="border-t border-gray-200 pt-3 mt-3">
          <p className="text-sm font-medium mb-1 text-gray-700">Verification</p>
          <textarea
            placeholder="Add remarks"
            value={verificationRemark}
            onChange={(e) => setVerificationRemark(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
          />
          <div className="flex justify-between gap-2">
            <button
              onClick={() => handleVerification("verify", verificationRemark)}
              disabled={isVerifying}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2 py-1 rounded transition"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
            <button
              onClick={() => handleVerification("reject", verificationRemark)}
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
        <div className="mt-4 border-t border-gray-200 pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Media ({crime.mediaUrl.length})
          </p>

          <div className="relative">
            {/* Media Gallery */}
            <div className="flex overflow-x-auto space-x-2">
              {crime.mediaUrl.map((media, index) => (
                <div
                  key={media._id}
                  className="relative w-20 h-20 cursor-pointer"
                  onClick={() => {
                    setSelectedMedia(media.url);
                    setCurrentMediaIndex(index);
                  }}
                >
                  {media.type === "image" ? (
                    <Image
                      src={media.url}
                      alt={crime.title || "Crime media"}
                      width={80}
                      height={80}
                      className="object-cover rounded-md border"
                    />
                  ) : (
                    <video
                      controls
                      className="rounded-md border w-full h-full object-cover"
                    >
                      <source src={media.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
            {/* Media Navigation Buttons */}
            <button
              onClick={() => handleMediaChange("prev")}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
            >
              &lt;
            </button>
            <button
              onClick={() => handleMediaChange("next")}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Lightbox Modal for Images/Video */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative w-[90vw] md:w-[60vw] h-[80vh]">
            {crime.mediaUrl[currentMediaIndex].type === "image" ? (
              <Image
                src={selectedMedia}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            ) : (
              <video controls className="w-full h-full rounded-lg">
                <source src={selectedMedia} type="video/mp4" />
              </video>
            )}
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
