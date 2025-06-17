"use client";

import CrimeReportForm from "@/components/CrimeReportForm/CrimeReportForm";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function ReportPage() {
  const handleCrimeSubmit = async (data: FormData): Promise<boolean> => {
    try {

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
    } catch (error: any) {
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
    }
    return false;
  };
  return <CrimeReportForm onSubmit={handleCrimeSubmit} />;
}
