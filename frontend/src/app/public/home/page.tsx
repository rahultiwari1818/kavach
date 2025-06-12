"use client";

import CrimeReportForm from "@/components/CrimeReportForm/CrimeReportForm";
import axios from "axios";

export default function ReportPage() {
  const handleCrimeSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/crime/report-crime`, data, {
        withCredentials: true,
      });
      console.log(response)
      // alert("Report submitted successfully.");
    } catch (error) {
      // alert("Failed to submit the report.");
      console.error(error);
    }
  };

  return <CrimeReportForm onSubmit={handleCrimeSubmit} />;
}
