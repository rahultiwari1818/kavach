import User from "../models/users.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { comparePassword, hashPassword } from "../utils/utils.js";
import { generateToken } from "../utils/webTokenUtils.js";
import { sendOTP } from "../utils/otpUtils.js";
export const loginController = async (req, res) => {
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
        }
        else {
            res.status(ResponseCode.BAD_REQUEST).json({
                message: "Incorrect Password.!",
            });
        }
    }
    catch (error) {
        console.error("Login Error:", error);
        res
            .status(ResponseCode.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
};
export const verifyEmail = async (req, res) => {
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
        }
        const isOtpSent = await sendOTP(email);
        if (isOtpSent) {
            res.status(ResponseCode.SUCCESS).json({
                message: "OTP sent successfully",
            });
            return;
        }
        else {
            res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
                message: "Error Occured While sending OTP!",
            });
            return;
        }
    }
    catch (error) {
        console.error("Email Verification Error:", error);
        res
            .status(ResponseCode.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
};
export const registerController = async (req, res) => {
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
        const token = generateToken({ email, _id: newUser._id });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });
        res.status(ResponseCode.CREATED).json({
            message: "User registered successfully.",
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        res
            .status(ResponseCode.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
};
// ----------------------------------------------------------------------- Util Funcations for Controllers ----------------------------------------------------------------------------------
export const doesUserAlreadyExist = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user == null ? false : true;
    }
    catch (error) {
        console.error(" Error while checking doesUserAlreadyExist:", error);
        return true;
    }
};
//# sourceMappingURL=users.controllers.js.map