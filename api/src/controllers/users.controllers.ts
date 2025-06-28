import { Request, Response } from "express";
import User from "../models/users.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { comparePassword, hashPassword } from "../utils/utils.js";
import { generateToken } from "../utils/webTokenUtils.js";
import { sendOTP, verifyOTP } from "../utils/otpUtils.js";
import oauth2Client from "../config/googleAuth.config.js";
import axios from "axios";
import userToken from "../interfaces/userToken.interface.js";

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(ResponseCode.BAD_REQUEST).json({
        message: "Email is not Registered!.",
      });
      return;
    }

    const isValid = await comparePassword(password, String(user.password));

    if (isValid) {
      const payload: userToken = {
        _id: String(user._id),
        email: user.email,
        role: user.role,
      };

      const token = generateToken(payload);

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      res.cookie("role", user.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      res.status(ResponseCode.SUCCESS).json({
        message: "Loggedin Successfully.!",
      });
    } else {
      res.status(ResponseCode.BAD_REQUEST).json({
        message: "Incorrect Password.!",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ message: "Email is required" });
      return;
    }

    const userExist = await doesUserAlreadyExist(email);
    if (userExist) {
      res.status(ResponseCode.CONFLICT).json({
        message: "User with this email already exists",
      });
      return;
    }

    const isOtpSent = await sendOTP(email);

    if (isOtpSent) {
      res.status(ResponseCode.SUCCESS).json({
        message: "OTP sent successfully",
      });
      return;
    } else {
      res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
        message: "Error Occured While sending OTP!",
      });
      return;
    }
  } catch (error) {
    console.error("Email Verification Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      role: "public",
      password: hashedPassword,
    });

    await newUser.save();

    const payload: userToken = {
      _id: String(newUser._id),
      email: newUser.email,
      role: newUser.role,
    };

    const token = generateToken(payload);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("role", newUser.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(ResponseCode.CREATED).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("role", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(ResponseCode.SUCCESS).json({
      message: "Logout Successfully.!",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const code = req.body.code;
    const googleRes = await oauth2Client.getToken(String(code || ""));
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name } = userRes.data;
    // console.log(userRes);
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: "public",
      });
    }
    const payload: userToken = {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.cookie("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(ResponseCode.SUCCESS).json({
      message: "User Loggedin Successfully.!",
      result: true,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};




export const forgotPasswordSendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ message: "Email is required" });
      return;
    }

    const userExist = await doesUserAlreadyExist(email);
    if (!userExist) {
      res.status(ResponseCode.CONFLICT).json({
        message: "Email is not registered.!",
      });
      return;
    }

    const isOtpSent = await sendOTP(email);

    if (isOtpSent) {
      res.status(ResponseCode.SUCCESS).json({
        message: "OTP sent successfully",
      });
      return;
    } else {
      res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
        message: "Error Occured While sending OTP!",
      });
      return;
    }
  } catch (error) {
    console.error("Email Sending for Forgot password Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};


export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, password, email } = req.body;

    if (!otp) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "OTP is required" });
      return;
    }
    if (!password) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
      return;
    }
    if (!email) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Email is required" });
      return;
    }

    // Verify OTP
    const isOTPValid = verifyOTP(otp, email);
    if (!isOTPValid) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Incorrect OTP" });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(ResponseCode.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(ResponseCode.SUCCESS).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Forgot password Error:", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};


// ----------------------------------------------------------------------- Util Funcations for Controllers ----------------------------------------------------------------------------------

export const doesUserAlreadyExist = async (email: string): Promise<Boolean> => {
  try {
    const user = await User.findOne({ email: email });
    return user == null ? false : true;
  } catch (error) {
    console.error(" Error while checking doesUserAlreadyExist:", error);
    return true;
  }
};
