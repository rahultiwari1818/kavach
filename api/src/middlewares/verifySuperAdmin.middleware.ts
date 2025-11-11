import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";

export const verifySuperAdmin =  (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      res
        .status(ResponseCode.FORBIDDEN)
        .json({ message: "Authentication token missing.!" });
      return;
    }
    const user = verifyToken(authToken);
    // console.log(user)
    if (user.role !== "super-admin") {
      res
        .status(ResponseCode.UNAUTHORIZED)
        .json({ message: "Login as Admin to use this feature.!" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error Occured While Verifying User :", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};
