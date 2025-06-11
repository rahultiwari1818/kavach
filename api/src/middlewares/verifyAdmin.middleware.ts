import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      return res.status(ResponseCode.FORBIDDEN).json({ message: "Authentication token missing.!" });
    }
    const user =  verifyToken(authToken);

    if(user.role !== "admin"){
              return res.status(ResponseCode.UNAUTHORIZED).json({ message: "Login as Admin to use this feature.!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error Occured While Verifying User :", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
}
