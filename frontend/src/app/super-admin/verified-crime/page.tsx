"use client";

import VerifiedCrimeDashboard from "@/components/VerifiedCrimeDashboard/VerifiedCrimeDashboard";

export default function SuperAdminVerifiedCrimesPage() {
  return <VerifiedCrimeDashboard role="super-admin" useDynamicMap={true} />;
}
