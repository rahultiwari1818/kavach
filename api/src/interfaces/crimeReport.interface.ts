import { Document, Types } from "mongoose";

export default interface CrimeReport extends Document {
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
    coordinates: [number, number]; // [lng, lat]
  };
  datetime: Date;
  mediaUrl?: Array<{
    url: string;
    type: string;
  }>;
  anonymous: boolean;
  reportedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified:boolean;
}
