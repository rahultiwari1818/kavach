import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "../../utils/responseCode.enum.js";

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
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message:"Internal Server Error.!"
    })
  }
};


export const registerValidations = (
     req: Request,
  res: Response,
  next: NextFunction
)=>{
    try {
    const { name,  email, password,otp } = req.body;

    
    if (!name) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Name is required" });
      return;
    }

    if (!email) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Email is required" });
      return;
    }
    
    if (!password) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
      return;
    }

    
    if (!otp) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: "Password is required" });
      return;
    }


    next();
  } catch (error) {
    console.log("Error Occured In Register Validations : ", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message:"Internal Server Error.!"
    })
  }
}

export const addAdminValidations = (req: Request, res: Response, next: NextFunction) : void => {
  const { name, email, password } = req.body;

  const errors: string[] = [];

  // Validate Name
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long.");
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    errors.push("A valid email address is required.");
  }

  // Validate Password
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  // If any validation fails
  if (errors.length > 0) {
     res.status(ResponseCode.BAD_REQUEST).json({ success: false, errors });
  }

  // Sanitize input (trim whitespace)
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};