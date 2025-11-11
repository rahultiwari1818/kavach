import { Schema, model, InferSchemaType } from "mongoose";
import AuditLog from "../interfaces/auditLog.interface.js";

const auditLogSchema = new Schema<AuditLog>(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetResource: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "N/A",
    },
    userRole: {
      type: String,
      enum: ["public", "admin", "super-admin"],
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetResource: 1 });

type AuditLogDoc = InferSchemaType<typeof auditLogSchema>;

const AuditLogModel = model<AuditLogDoc>("AuditLog", auditLogSchema);

export default AuditLogModel;
