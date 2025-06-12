import { Request, Response } from "express";
import CrimeReportModel from "../models/crimeReport.model";
import { ResponseCode } from "../utils/responseCode.enum";

export const crimeReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      type,
      description,
      location,
      datetime,
      mediaUrl,
      anonymous
    } = req.body;

    const reportedBy = req.user?._id; // Comes from verifyUser middleware

    const report = new CrimeReportModel({
      title,
      type,
      description,
      location,
      datetime,
      mediaUrl,
      anonymous,
      reportedBy
    });

    await report.save();

    res.status(ResponseCode.CREATED).json({
      message: "Crime report submitted successfully.",
      report
    });
  } catch (error) {
    console.error("Crime Reporting Error:", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error"
    });
  }
};
