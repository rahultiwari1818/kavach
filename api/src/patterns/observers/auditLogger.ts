import { appEventEmitter } from "./eventEmitter.js";
import AuditLogModel from "../../models/auditLog.model.js";
import { Types } from "mongoose";

/**
 * Observer that listens to system events and logs them to the AuditLog collection.
 */
class AuditLogger {
  constructor() {
    this.initializeListeners();
    console.log("setup")
  }

  private initializeListeners() {
    // Crime verification event
    
    appEventEmitter.on("crime_verified", async (data) => {
      await this.logEvent({
        action: "Crime Verified",
        performedBy: data.performedBy,
        targetResource: "CrimeReport",
        targetId: data.crimeId,
        details: data.details || "A crime report was verified by an admin.",
        userRole: data.userRole,
        ipAddress: data.ipAddress,
      });
    });

    // Admin status updated event
    appEventEmitter.on("admin_status_updated", async (data) => {
        
      await this.logEvent({
        action: "Admin Status Updated",
        performedBy: data.performedBy,
        targetResource: "User",
        targetId: data.adminId,
        details: data.details || "Admin account activation status changed.",
        userRole: data.userRole,
        ipAddress: data.ipAddress,
      });
    });

    // New admin added event
    appEventEmitter.on("admin_added", async (data) => {
      await this.logEvent({
        action: "New Admin Added",
        performedBy: data.performedBy,
        targetResource: "User",
        targetId: data.adminId,
        details: data.details || "A new admin account was created.",
        userRole: data.userRole,
        ipAddress: data.ipAddress,
      });
    });
  }

  private async logEvent(logData: {
    action: string;
    performedBy: Types.ObjectId;
    targetResource: string;
    targetId?: Types.ObjectId;
    details?: string;
    userRole: string;
    ipAddress?: string;
  }) {
    try {
      await AuditLogModel.create({
        ...logData,
      });
      console.log(`[AuditLog] Logged event: ${logData.action}`);
    } catch (error) {
      console.error(`[AuditLog Error] Failed to log event: ${error}`);
    }
  }
}

export const auditLogger = new AuditLogger(); // Auto-register observer

