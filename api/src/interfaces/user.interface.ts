import { Document } from "mongoose";
import userToken from "./userToken.interface";

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'public' | 'private' | 'admin' | 'Super-admin';
  createdAt: Date;
}


declare global {
  namespace Express {
    interface Request {
      user?: userToken;
    }
  }
}