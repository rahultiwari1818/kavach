"use client";

import CrimeReportForm from "@/components/CrimeReportForm/CrimeReportForm";
import Overlay from "@/components/Overlay/Overlay";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ReportPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCrimeSubmit = async (data: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/crime/report-crime`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("Report submitted successfully!");
      } else {
        toast.warn("Unexpected response from server.");
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof AxiosError)
        if (error.response) {
          // Backend error
          toast.error(
            `Error: ${error.response.data.message || "Something went wrong."}`
          );
        } else if (error.request) {
          // No response
          toast.error("No response from server.");
        } else {
          // Other error
          toast.error("Request error: " + error.message);
        }
    } finally {
      setIsLoading(false);
    }
    return false;
  };
  return (
    <>
      <Overlay open={isLoading} />
      <CrimeReportForm onSubmit={handleCrimeSubmit} />
    </>
  );
}
