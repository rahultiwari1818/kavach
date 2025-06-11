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
  location: string;
  datetime: Date; // when the crime occurred
  mediaUrl?: string; // optional proof or evidence (e.g., image/video)
  anonymous: boolean;
  reportedBy: Types.ObjectId; // Only present if not anonymous
  createdAt?: Date;
  updatedAt?: Date;
}
