"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "./authform.css";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

type AuthStep = "form" | "otp";
type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("form");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (step === "form") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-email`,
            {
              email,
            },
            { withCredentials: true }
          );

          toast.success(res.data.message || "OTP sent to your email.");
          setStep("otp");
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          if (error.response) toast.error(error.response.data.message);
        }
        return;
      }

      // step === 'otp'
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
          {
            name,
            email,
            password,
            otp,
          },
          { withCredentials: true }
        );
        toast.success("Registration successful!");
        router.push("/home");
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response) toast.error(error.response.data.message);
      }
    } else {
      // login logic
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        router.push("/home");
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response) toast.error(error.response.data.message);
      }
    }
  };

  const googleAuth = (code: string) =>
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/googleAuth?`,
      {
        code:code
      },
      { withCredentials: true }
    );

  const googleResponse = async (authResult: object) => {
    try {
      if ("code" in authResult) {
        const code = (authResult as { code: string }).code;
        await googleAuth(code);
        router.push("/home");
      }
    } catch (error) {
      console.log("Error While G Auth :", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="bg-image"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {mode === "login" ? "Login to Kavach" : "Register for Kavach"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && step === "form" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(mode === "login" || mode === "register") && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {mode === "register" && step === "otp" && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
          >
            {mode === "register"
              ? step === "form"
                ? "Send OTP"
                : "Verify & Register"
              : "Sign In"}
          </button>
        </form>

        <button
          className="flex px-3 py-2 rounded-lg  my-2 w-full justify-around font-bold text-red-500 items-center gap-5 border border-red-500 bg-white"
          onClick={googleLogin}
        >
          {mode === "register"
            ? "SignUp Using Google "
            : "SignIn Using Google "}
          <Image src={"/GoogleIcon.png"} alt="google" width={20} height={20} />
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
