import { Schema, model, InferSchemaType } from "mongoose";
import CrimeReport from "../interfaces/crimeReport.interface.js";

const crimeReportSchema = new Schema<CrimeReport>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        "theft",
        "assault",
        "fraud",
        "murder",
        "vandalism",
        "cybercrime",
        "domestic violence",
        "drug-related",
        "kidnapping",
        "sexual harassment",
        "homicide",
        "burglary",
        "vehicle theft",
        "arson",
        "terrorism",
        "human trafficking",
        "illegal possession",
        "public disturbance",
        "corruption",
        "other",
      ],
    },
    description: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
    datetime: { type: Date, required: true },
    mediaUrl: [
      {
        url: { type: String },
        type: { type: String },
      },
    ],
    anonymous: { type: Boolean, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationStatus: { type: String,
      required: true,
      enum: [
        "verified" , "pending" , "rejected"
      ],
    default:"pending"
   },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verificationRemarks:{
      type:String,
      default:""
    }
  },
  { timestamps: true }
);

crimeReportSchema.index({ location: "2dsphere" });

// Infer the actual schema type
type CrimeReportDoc = InferSchemaType<typeof crimeReportSchema>;

const CrimeReportModel = model<CrimeReportDoc>("CrimeReport", crimeReportSchema);

export default CrimeReportModel;
