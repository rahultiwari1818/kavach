import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'public';
  createdAt: Date;
}


declare global {
  namespace Express {
    interface Request {
      user?: Object;
    }
  }
}