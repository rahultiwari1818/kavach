import { Request, Response, NextFunction } from "express";
import { ResponseCode } from "../../utils/responseCode.enum.js";

export const loginValidations = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;


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
      res.status(ResponseCode.BAD_REQUEST).json({ message: "fdasdfkmsdl is required" });
      return;
    }


    next();
  } catch (error) {
    console.log("Error Occured In Register Validations : ", error);
    res.status(ResponseCode.CONFLICT).json({
      message:"Internal Server Error.!"
    })
  }
}