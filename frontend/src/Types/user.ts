import { Crime } from "./crime";

export interface UserRes {
  _id: string;
  name: string;
  email: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalCrimesReported: number;
  crimes?: Crime[];
}
