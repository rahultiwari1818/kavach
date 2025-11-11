import { ObjectId } from "mongoose";

export default interface AuditLog {
  action: string; // e.g., "Crime Verified", "User Deactivated"
  performedBy: ObjectId; // User who performed the action
  targetResource: string; // e.g., "CrimeReport", "User"
  targetId?: ObjectId; // ID of the affected document
  details?: string; // Optional details or remarks
  ipAddress?: string; // IP address of the user
  userRole: "public" | "admin" | "super-admin"; // Role of the actor
  createdAt?: Date; // Timestamp (auto-added by Mongoose)
  updatedAt?: Date; // Timestamp (auto-updated by Mongoose)
}
