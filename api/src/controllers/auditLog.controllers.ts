import { Request, Response } from "express";
import AuditLogModel from "../models/auditLog.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";

/**
 * Controller: Get all audit logs with optional filters and pagination
 * Supports filters like performedBy, action, userRole
 */
export const getAllAuditLogsController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract filters and pagination options from query params
    const {
      page = 1,
      limit = 20,
      performedBy,
      action,
      userRole,
      startDate,
      endDate,
    } = req.query;

    const filters: Record<string, any> = {};

    if (performedBy) filters.performedBy = performedBy;
    if (action) filters.action = { $regex: new RegExp(String(action), "i") };
    if (userRole) filters.userRole = userRole;
    if (startDate && endDate) {
      filters.timestamp = {
        $gte: new Date(String(startDate)),
        $lte: new Date(String(endDate)),
      };
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    // Query logs
    const logs = await AuditLogModel.find(filters)
      .populate("performedBy", "name email role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(numericLimit);
    
    // Count total matching records
    const totalLogs = await AuditLogModel.countDocuments(filters);

    res.status(ResponseCode.SUCCESS).json({
      message: "Audit logs fetched successfully.",
      data: logs,
      pagination: {
        total: totalLogs,
        page: numericPage,
        totalPages: Math.ceil(totalLogs / numericLimit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error while fetching audit logs." });
  }
};
