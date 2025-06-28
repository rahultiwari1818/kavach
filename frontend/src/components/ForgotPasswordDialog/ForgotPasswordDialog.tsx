"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Dialog from "../Dialog/Dialog";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPassword = async () => {
    try {
      if (step === "email") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/sendOTP`,
          { email },
          { withCredentials: true }
        );
        toast.success("OTP sent to your email.");
        setStep("otp");
      } else if (step === "otp") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`,
          {
            email,
            otp,
            password:newPassword,
          },
          { withCredentials: true }
        );
        toast.success("Password reset successfully!");
        handleClose();
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) toast.error(error.response.data.message);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Forgot Password"
      showActions={true}
      onConfirm={handleForgotPassword}
      confirmText={step === "email" ? "Send OTP" : "Reset Password"}
    >
      {step === "email" ? (
        <>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mt-3">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </>
      )}
    </Dialog>
  );
}
