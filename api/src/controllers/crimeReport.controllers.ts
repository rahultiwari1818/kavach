import { Request, Response } from "express";
import CrimeReportModel from "../models/crimeReport.model";
import { ResponseCode } from "../utils/responseCode.enum";
import { uploadToCloudinary } from "../config/cloudinary.config";

export const crimeReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      type,
      description,
      latitude,
      longitude,
      datetime,
      anonymous,
    } = req.body;

    const reportedBy = req.user?._id;

    const mediaFiles = req.files as Express.Multer.File[];
    const mediaUrl: { url: string; type: string }[] = [];

    if (mediaFiles?.length > 0) {
      for (const file of mediaFiles) {
        const resourceType = file.mimetype.startsWith("video")
          ? "video"
          : "image";
        const uploadResult = await uploadToCloudinary(file.path, resourceType);
        if (uploadResult.message === "Success") {
          mediaUrl.push({ url: uploadResult.url, type: resourceType });
        }
      }
    }

    const report = new CrimeReportModel({
      title,
      type,
      description,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      datetime: new Date(datetime),
      mediaUrl,
      anonymous: anonymous === "true", // ensure boolean
      reportedBy,
    });

    await report.save();

    res.status(ResponseCode.CREATED).json({
      message: "Crime report submitted successfully.",
      report,
    });
  } catch (error) {
    console.error("Crime Reporting Error:", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const getNearbyCrimes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      res
        .status(ResponseCode.BAD_REQUEST)
        .json({ message: "Invalid or missing latitude/longitude" });
    }

    const crimes = await CrimeReportModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: 3000, // meters
          spherical: true,
        },
      },
    ]);

    res
      .status(ResponseCode.SUCCESS)
      .json({ data: crimes, message: "Crimes Data Successfully Fetched" });
  } catch (err) {
    console.error("Error fetching nearby crimes:", err);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error.!" });
  }
};
