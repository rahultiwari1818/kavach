import { Schema, model, Types } from "mongoose";
import CrimeReport from "../interfaces/crimeReport.interface";

const crimeReportSchema = new Schema<CrimeReport>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'theft',
        'assault',
        'fraud',
        'murder',
        'vandalism',
        'cybercrime',
        'domestic violence',
        'drug-related',
        'kidnapping',
        'sexual harassment',
        'homicide',
        'burglary',
        'vehicle theft',
        'arson',
        'terrorism',
        'human trafficking',
        'illegal possession',
        'public disturbance',
        'corruption',
        'other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    anonymous: {
      type: Boolean,
      required: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // ✅ Required
    },
  },
  {
    timestamps: true,
  }
);

export default model<CrimeReport>("CrimeReport", crimeReportSchema);
