"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminForm({
  onAdminAdded,
}: {
  onAdminAdded: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Adding new admin...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/add-admin`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.dismiss(loadingToast);

      if (res.status === 201 || res.status === 200) {
        toast.success("  Admin added successfully!");
        setFormData({ name: "", email: "", password: "" });
        onAdminAdded();
      } else {
        toast.warn("  Unexpected response from server.");
      }
    } catch (err: unknown) {
      toast.dismiss(loadingToast);

      if (axios.isAxiosError(err)) {
        toast.error(
          `  ${
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to add admin"
          }`
        );
      } else {
        toast.error("  An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Admin</h2>

      <label className="block mb-3">
        <span className="text-gray-700">Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter name"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email"
        />
      </label>

      <label className="block mb-5">
        <span className="text-gray-700">Initial Password</span>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter initial password"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Admin
      </button>
    </form>
  );
}
