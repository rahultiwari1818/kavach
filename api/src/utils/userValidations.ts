import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "./responseCode.enum.js";

export const loginValidations = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Email is required" });
      return;
    }
    
    if (!password) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
      return;
    }
    
    next();
  } catch (error) {
    console.log("Error Occured In Login Validations : ", error);
  }
};
