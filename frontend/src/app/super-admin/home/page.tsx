"use client";

import CrimeManagementDashboard from "@/components/CrimeManagementDashboard/CrimeManagementDashboard";

export default function SuperAdminCrimesPage() {
  return <CrimeManagementDashboard role="super-admin" useDynamicMap={true} />;
}
