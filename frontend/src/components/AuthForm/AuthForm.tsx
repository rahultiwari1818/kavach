"use client";

import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "./authform.css";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Cookies from "js-cookie";
import ForgotPasswordDialog from "../ForgotPasswordDialog/ForgotPasswordDialog";
import Overlay from "../Overlay/Overlay";

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
  const [isOpenForgotPassWordDialog, setIsOpenForgotPasswordDialog] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const openForgotPasswordDialog = () => {
    setIsOpenForgotPasswordDialog(true);
  };

  const closeForgotPasswordDialog = useCallback(() => {
    setIsOpenForgotPasswordDialog(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (step === "form") {
        try {
          setIsLoading(true);
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/verify-email`,
            { email },
            { withCredentials: true }
          );

          setIsLoading(false);
          toast.success(res.data.message || "OTP sent to your email.");
          setStep("otp");
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          if (error.response) toast.error(error.response.data.message);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
          { name, email, password, otp },
          { withCredentials: true }
        );

        setIsLoading(false);
        toast.success("Registration successful!");
        const role = Cookies.get("role");
        if (role === "admin") {
          router.push("/admin/home");
        } else if (role === "super-admin") {
          router.push("/super-admin/home");
        } else {
          router.push("/public/home");
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response) toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
          { email, password },
          { withCredentials: true }
        );
        const role = Cookies.get("role");
        if (role === "admin") {
          router.push("/admin/home");
        } else {
          router.push("/public/home");
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response) toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const googleAuth = (code: string) =>
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/googleAuth`,
      { code },
      { withCredentials: true }
    );

  const googleResponse = async (authResult: object) => {
    try {
      if ("code" in authResult) {
        const code = (authResult as { code: string }).code;
        await googleAuth(code);
        const role = Cookies.get("role");
        if (role === "admin") {
          router.push("/admin/home");
        } else {
          router.push("/public/home");
        }
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
    <>
      <Overlay open={isLoading} />
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

          {mode === "login" && (
            <button
              onClick={openForgotPasswordDialog}
              className="w-full mt-2 text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}

          <button
            className="flex px-3 py-2 rounded-lg my-2 w-full justify-around font-bold text-red-500 items-center gap-5 border border-red-500 bg-white"
            onClick={googleLogin}
          >
            {mode === "register"
              ? "SignUp Using Google"
              : "SignIn Using Google"}
            <Image
              src={"/GoogleIcon.png"}
              alt="google"
              width={20}
              height={20}
            />
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
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

      <ForgotPasswordDialog
        isOpen={isOpenForgotPassWordDialog}
        onClose={closeForgotPasswordDialog}
      />
    </>
  );
}
