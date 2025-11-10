import { Request, Response } from "express";
import User from "../models/users.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import {
  comparePassword,
  emailHTMLTemplate,
  hashPassword,
} from "../utils/utils.js";
import { generateToken } from "../utils/webTokenUtils.js";
import { sendOTP, verifyOTP } from "../utils/otpUtils.js";
import oauth2Client from "../config/googleAuth.config.js";
import axios from "axios";
import userToken from "../interfaces/userToken.interface.js";
import { sendMail } from "../config/mail.config.js";

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

    const isValidPassword = await comparePassword(
      password,
      String(user.password)
    );

    const isActive = user.isActive;

    if (isValidPassword && isActive) {
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
      if (!isValidPassword)
        res.status(ResponseCode.BAD_REQUEST).json({
          message: "Incorrect Password.!",
        });
      else
        res.status(ResponseCode.BAD_REQUEST).json({
          message: "Login Disabled .!",
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
    else{
      if(!user.isActive){
        res.status(ResponseCode.FORBIDDEN).json({
          message:"Login Disabled",
          result:false
        })
        return;
      }
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

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { otp, password, email } = req.body;

    if (!otp) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "OTP is required" });
      return;
    }
    if (!password) {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ message: "Password is required" });
      return;
    }
    if (!email) {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ message: "Email is required" });
      return;
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(otp, email);
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

    res
      .status(ResponseCode.SUCCESS)
      .json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Forgot password Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export const addAdminController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(ResponseCode.CONFLICT)
        .json({ error: "An account with this email already exists." });
      return;
    }

    // Check if the request is made by a super admin
    const requester = (req as any).user; // assuming user info is attached via JWT middleware
    if (!requester || requester.role !== "super-admin") {
      res
        .status(ResponseCode.FORBIDDEN)
        .json({ error: "Access denied. Only super admins can add admins." });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    const body = `
  <p>Hello,</p>
  <p>You have been added as a new <strong>Admin</strong> on <b>Kavach App</b>.</p>
  <p>Here are your login details:</p>
  <ul>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Password:</strong> ${password}</li>
  </ul>
  <p>For your security, please reset your password after your first login.</p>
  <p>Welcome aboard,<br/>The Kavach Team</p>
`;

    sendMail(email, "Added As Admin on Kavach", emailHTMLTemplate(body));

    res.status(ResponseCode.CREATED).json({
      message: "Admin added successfully.",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error while adding admin." });
  }
};

export const getAdminsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const admins = await User.find({ role: "admin" }).select(
      "_id name email isActive"
    );
    if (!admins || admins.length === 0) {
      res.status(ResponseCode.SUCCESS).json({data:[], message: "No admins found." });
      return;
    }

    res
      .status(ResponseCode.SUCCESS)
      .json({ data: admins, message: "Admins Fetched Successfully!" });
  } catch (error) {
    console.error("Error fetching admin:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error while Fetching admin." });
  }
};

export const updateActiveStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (!userId || typeof isActive !== "boolean") {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ error: "Invalid request. userId and isActive are required." });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select("_id name email isActive role");

    if (!updatedUser) {
      res.status(ResponseCode.NOT_FOUND).json({ error: "User not found." });
      return;
    }

    res.status(ResponseCode.SUCCESS).json({
      message: "User active status updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error Updating Active Status:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error while Updating Active Status." });
  }
};


export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const usersWithCrimeCount = await User.aggregate([
      { $match: { role: "public" } },

      {
        $lookup: {
          from: "crimereports",      // collection name of crime reports
          localField: "_id",
          foreignField: "reportedBy",
          as: "crimeReports"
        }
      },

      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          isActive: 1,
          totalCrimesReported: { $size: "$crimeReports" },
          crimes: {
            $map: {
              input: "$crimeReports",
              as: "crime",
              in: {
                _id: "$$crime._id",
                title: "$$crime.title",
                type: "$$crime.type",
                description: "$$crime.description",
                datetime: "$$crime.datetime",
                isVerified: "$$crime.isVerified",
                location: "$$crime.location"
              }
            }
          }
        }
      }
    ]);

    if (!usersWithCrimeCount || usersWithCrimeCount.length === 0) {
      res
        .status(ResponseCode.SUCCESS)
        .json({ data: [], message: "No Users found." });
      return;
    }

    res
      .status(ResponseCode.SUCCESS)
      .json({ data: usersWithCrimeCount, message: "Users Fetched Successfully!" });

  } catch (error) {
    console.error("Error Fetching All Users:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
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
