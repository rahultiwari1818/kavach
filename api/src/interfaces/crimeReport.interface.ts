// src/interfaces/crimeReport.interface.ts
import { Types, Document } from "mongoose";

export default interface CrimeReport {
  title: string;
  type:
    | "theft"
    | "assault"
    | "fraud"
    | "murder"
    | "vandalism"
    | "cybercrime"
    | "domestic violence"
    | "drug-related"
    | "kidnapping"
    | "sexual harassment"
    | "homicide"
    | "burglary"
    | "vehicle theft"
    | "arson"
    | "terrorism"
    | "human trafficking"
    | "illegal possession"
    | "public disturbance"
    | "corruption"
    | "other";
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  datetime: Date;
  mediaUrl?: Array<{
    url: string;
    type: string;
  }>;
  anonymous: boolean;
  reportedBy: Types.ObjectId;
  verifiedBy: Types.ObjectId | null;
  verificationStatus: "verified" | "pending" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  verificationRemarks?:string;
}
