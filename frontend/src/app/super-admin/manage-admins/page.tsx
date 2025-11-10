"use client";
import React, { useState } from "react";
import AdminForm from "@/components/AdminForm/AdminForm";
import AdminList from "@/components/AdminList/AdminList";

export default function Page() {
  const [refresh, setRefresh] = useState(false);

  const handleAdminAdded = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <AdminForm onAdminAdded={handleAdminAdded} />
      {/* Force re-render AdminList when a new admin is added */}
      <AdminList key={refresh ? "refresh-true" : "refresh-false"} />
    </div>
  );
}
