import {Schema , model} from 'mongoose';
import { User } from '../interfaces/user.interface.js';

const userSchema = new Schema<User>({
   name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'public'], default: 'public' },
  createdAt: { type: Date, default: Date.now }
});

export default model<User>("User",userSchema);