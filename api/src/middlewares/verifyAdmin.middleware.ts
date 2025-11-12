import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { verifyToken } from "../utils/webTokenUtils.js";

export const verifyAdmin =  (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let req1 = req;
    const { authToken } = req1;
    if (!authToken) {
      res
        .status(ResponseCode.CREATED)
        .json({ message: "Authentication token missing.!" });
      return;
    }
    const user = verifyToken(authToken);

    if (user.role !== "admin") {
      res
        .status(ResponseCode.UNAUTHORIZED)
        .json({ message: "Login as Admin feature.!" });
      return;
    }

    req1.user = user;
    next();
  } catch (error) {
    console.log("Error Occured While Verifying User :", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};
