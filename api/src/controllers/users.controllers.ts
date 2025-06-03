import { Request, Response } from "express";
import User from "../models/users.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { comparePassword } from "../utils/utils.js";
import { generateToken } from "../utils/webTokenUtils.js";

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
      const payload = {
        email: user.email,
        _id: user._id,
      };

      const token = generateToken(payload);

      res.cookie("authToken", token, {
        httpOnly: true,
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};
