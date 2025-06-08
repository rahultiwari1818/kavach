"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/logout`,
        {},
        {
          withCredentials: true, // important for sending cookies
        }
      );

      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="px-5 py-3 bg-gray-100 flex justify-between items-center">
      <Image src={"/logo.jpg"} alt="logo" width={100} height={100} />
      <button
        className="px-5 py-2 rounded shadow bg-red-500 text-white"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </nav>
  );
}
