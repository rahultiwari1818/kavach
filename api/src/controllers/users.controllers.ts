import { Request, Response } from "express";
import User from "../models/users.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { comparePassword, generateOTP } from "../utils/utils.js";
import { generateToken } from "../utils/webTokenUtils.js";
import { client } from "../config/redis.config.js";
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

  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};





// ----------------------------------------------------------------------- Util Funcations for Controllers ----------------------------------------------------------------------------------

export const doesUserAlreadyExist = async (email: string): Promise<Boolean> => {
  try {
    const user = await User.findOne({ email: email });

    return user != undefined ? false : true;
  } catch (error) {
    console.error(" Error while checking doesUserAlreadyExist:", error);
    return true;
  }
};

export const sendOTP = async (email: string): Promise<Boolean> => {
  try {
    const otp: string = generateOTP();
    await client.set(email, otp);
    const resp = await sendMail(
      email,
      "Verification OTP",
      `Your OTP is ${otp}`
    );
    return resp;
  } catch (error) {
    console.error(" Error while Sending OTP :", error);
    return false;
  }
};
