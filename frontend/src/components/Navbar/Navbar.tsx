"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    }
  };

  const role = Cookies.get("role");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-blue-600">Kavach</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {role === "super-admin" ? (
            <>
              <Link href="/super-admin/home" className="nav-link">
                Home
              </Link>
              <Link href="/super-admin/manage-admins" className="nav-link">
                Manage Admins
              </Link>
              <Link href="/super-admin/manage-users" className="nav-link">
                Manage Users
              </Link>
              
              <Link href="/super-admin/verified-crime" className="nav-link">
                Verified Crimes
              </Link>
            </>
          ) : role === "admin" ? (
            <>
              <Link href="/admin/home" className="nav-link">
                Home
              </Link>
              <Link href="/admin/verified-crime" className="nav-link">
                Verified Crimes
              </Link>
            </>
          ) : (
            <>
              <Link href="/public/home" className="nav-link">
                Home
              </Link>
              <Link href="/public/crime-report" className="nav-link">
                Report Crime
              </Link>
              <Link href="/public/my-reported-crimes" className="nav-link">
                View Reported Crimes
              </Link>
              
            </>
          )}
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            className="text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 px-4">
          {role === "super-admin" ? (
            <>
              <Link href="/super-admin/home" className="block nav-link">
                Home
              </Link>
              <Link href="/super-admin/manage-admins" className="block nav-link">
                Manage Admins
              </Link>
              <Link href="/super-admin/manage-users" className="block nav-link">
                Manage Users
              </Link>
              
              <Link href="/super-admin/verified-crime" className="block nav-link">
                Verified Crimes
              </Link>
            </>
          ) : role === "admin" ? (
            <>
              <Link href="/admin/home" className="block nav-link">
                Home
              </Link>
              <Link href="/admin/verified-crime" className="block nav-link">
                Verified Crimes
              </Link>
            </>
          ) : (
            <>
              <Link href="/public/home" className="block nav-link">
                Home
              </Link>
              <Link href="/public/crime-report" className="block nav-link">
                Report Crime
              </Link>
              <Link href="/public/my-reported-crimes" className="block nav-link">
                View Reported Crimes
              </Link>
              
            </>
          )}
          <button
            onClick={logoutHandler}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
