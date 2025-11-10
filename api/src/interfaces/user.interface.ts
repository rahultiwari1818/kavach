import { Document } from "mongoose";
import userToken from "./userToken.interface.js";

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  role:'super-admin' | 'admin' | 'public';
  isActive:boolean;
  createdAt: Date;
}


declare global {
  namespace Express {
    interface Request {
      user?: userToken;
    }
  }
}