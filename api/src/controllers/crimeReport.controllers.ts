import { Request, Response } from "express";
import CrimeReportModel from "../models/crimeReport.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import CrimeReport from "../interfaces/crimeReport.interface.js";
import { appEventEmitter } from "../patterns/observers/eventEmitter.js";
import { CrimeVerificationContext } from "../patterns/state/CrimeVerificationContext.js";

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

// controllers/crimeController.ts

export const getNearbyCrimes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 3000;
    const type = (req.query.type as string) || "All";
    const time = (req.query.time as string) || "7d"; // default: past 7 days

    if (isNaN(lat) || isNaN(lng)) {
      res.status(ResponseCode.BAD_REQUEST).json({
        message: "Invalid or missing latitude/longitude",
      });
      return;
    }

    // 🕒 Construct match filter
    const matchFilter: any = { verificationStatus: "verified" };

    // 🔹 Filter by type (ignore if 'All')
    if (type && type !== "All") {
      matchFilter.type = { $regex: new RegExp(type, "i") };
    }

    // 🔹 Compute time filter
    const now = new Date();
    const from = new Date();

    switch (time) {
      case "24h":
        from.setDate(now.getDate() - 1);
        break;
      case "7d":
        from.setDate(now.getDate() - 7);
        break;
      case "30d":
        from.setDate(now.getDate() - 30);
        break;
      case "60d":
        from.setDate(now.getDate() - 60);
        break;
      case "quarter":
        from.setMonth(now.getMonth() - 3);
        break;
      case "half":
        from.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        from.setFullYear(now.getFullYear() - 1);
        break;
      case "All":
      default:
        // No time filter
        break;
    }

    if (time !== "All") {
      matchFilter.datetime = { $gte: from, $lte: now };
    }

    // 📍 Geo + Lookup Aggregation
    const crimes = await CrimeReportModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: radius, // meters
          spherical: true,
          query: matchFilter,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: "$reportedBy" },
      { $unset: "reportedBy.password" },
      { $sort: { datetime: -1 } },
    ]);

    res.status(ResponseCode.SUCCESS).json({
      data: crimes,
      message: "Nearby crimes fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching nearby crimes:", err);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyCrimeReports = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?._id;

    const myReports = await CrimeReportModel.find({ reportedBy: userId }).sort({
      createdAt: -1,
    });
    res.status(ResponseCode.SUCCESS).json({ data: myReports });
  } catch (err) {
    console.error("Error fetching user's crime reports:", err);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch your crime reports." });
  }
};

export const getAllUnverifiedCrimes = async (req: Request, res: Response) => {
  try {
    const crimes = await CrimeReportModel.aggregate([
      {
        $match: { verificationStatus: "pending" }, // 🔍 only unverified crimes
      },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      {
        $unwind: "$reportedBy",
      },
      {
        $unset: "reportedBy.password", // 🛡️ remove password field
      },
    ]);

    res.status(ResponseCode.SUCCESS).json({ data: crimes });
  } catch (error) {
    console.error("Getting Unverified Crime Error:", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllverifiedCrimes = async (req: Request, res: Response) => {
  try {
    const { type, fromDate } = req.query;

    const matchFilter: any = { verificationStatus: "verified" };

    // 🔹 Filter by type (case-insensitive)
    if (type) {
      matchFilter.type = { $regex: new RegExp(type.toString(), "i") };
    }

    // 🔹 Date filter: from 'fromDate' (or last 7 days) to now
    const now = new Date();
    const from =
      fromDate && fromDate !== "all"
        ? new Date(fromDate as string)
        : new Date(now);
    if (!fromDate) from.setDate(now.getDate() - 7); // default: past 7 days

    if (fromDate && fromDate !== "all") {
      matchFilter.datetime = {
        $gte: from,
        $lte: now,
      };
    }

    const crimes = await CrimeReportModel.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: { path: "$reportedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "verifiedBy",
          foreignField: "_id",
          as: "verifiedBy",
        },
      },
      { $unwind: { path: "$verifiedBy", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "reportedBy.password": 0,
          "verifiedBy.password": 0,
          "reportedBy.__v": 0,
          "verifiedBy.__v": 0,
        },
      },
      { $sort: { datetime: -1 } },
    ]);

    res.status(ResponseCode.SUCCESS).json({
      data: crimes,
      message: "Verified crimes (default: past 7 days)",
      filters: matchFilter,
    });
  } catch (error) {
    console.error("Error fetching verified crimes:", error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const changeVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const userId = req.user?._id;

    const crime = await CrimeReportModel.findById(id);
    if (!crime) {
      res.status(ResponseCode.NOT_FOUND).json({ message: "Crime not found" });
      return;
    }

    const context = new CrimeVerificationContext(id, crime.verificationStatus,remarks);

    if (status === "verify") await context.getState().verify(remarks);
    else if (status === "reject") await context.getState().reject(remarks);

    // Emit Audit Event
    appEventEmitter.emit("crime_verification_updated", {
      performedBy: userId,
      crimeId: id,
      newStatus: status,
      remarks,
      ipAddress: req.ip,
    });

    res.status(ResponseCode.SUCCESS).json({
      message: `Crime marked as ${status}`,
      status: context.getState().getStatus(),
    });
  } catch (error: any) {
    console.error("Crime verification error:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const getCrimeClusters = async (req: Request, res: Response) => {
  try {
    const radiusInMeters = 1000;
    const minClusterSize = 10;

    const allCrimes = (await CrimeReportModel.find(
      {},
      { location: 1 }
    )) as CrimeReport[];

    const visited = new Set();
    const clusters: any[] = [];

    for (let i = 0; i < allCrimes.length; i++) {
      if (visited.has(allCrimes[i]._id?.toString())) continue;

      const centerCrime = allCrimes[i];
      const nearbyCrimes = await CrimeReportModel.find({
        location: {
          $nearSphere: {
            $geometry: centerCrime.location,
            $maxDistance: radiusInMeters,
          },
        },
      });

      const clusterCrimes = nearbyCrimes.filter(
        (c) => !visited.has(c._id.toString())
      );

      if (clusterCrimes.length >= minClusterSize) {
        clusterCrimes.forEach((c) => visited.add(c._id.toString()));
        const avgLat =
          clusterCrimes.reduce((sum, c) => sum + c.location.coordinates[1], 0) /
          clusterCrimes.length;
        const avgLng =
          clusterCrimes.reduce((sum, c) => sum + c.location.coordinates[0], 0) /
          clusterCrimes.length;

        clusters.push({
          center: { lat: avgLat, lng: avgLng },
          count: clusterCrimes.length,
          crimes: clusterCrimes.map((c) => ({
            id: c._id,
            lat: c.location.coordinates[1],
            lng: c.location.coordinates[0],
          })),
        });
      }
    }

    res.status(200).json({ clusters });
  } catch (err) {
    console.error("Error clustering crimes:", err);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const getCrimesController = async (req: Request, res: Response) => {
  try {
    const { status = "pending", type, fromDate, lat, lng, radius } = req.query;

    const hasGeoFilter = lat && lng && radius;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const distance = parseFloat(radius as string);

    const matchStage: Record<string, any> = {};

    if (status && ["verified", "pending", "rejected"].includes(String(status))) {
      matchStage.verificationStatus = status;
    }

    if (type && type !== "All") matchStage.type = type;

    if (fromDate && fromDate !== "All") {
      matchStage.datetime = { $gte: new Date(fromDate as string) };
    }

    // === Base Pipeline ===
    const pipeline: any[] = [];

    // Add geo stage first if geo filters exist
    if (hasGeoFilter && !isNaN(latitude) && !isNaN(longitude) && !isNaN(distance)) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: distance,
        },
      });
    }

    // Apply filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Populate reportedBy and verifiedBy
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: { path: "$reportedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "verifiedBy",
          foreignField: "_id",
          as: "verifiedBy",
        },
      },
      { $unwind: { path: "$verifiedBy", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          type: 1,
          description: 1,
          datetime: 1,
          location: 1,
          mediaUrl: 1,
          anonymous: 1,
          verificationStatus: 1,
          verificationRemarks: 1,
          distance: 1,
          "reportedBy._id": 1,
          "reportedBy.name": 1,
          "reportedBy.email": 1,
          "verifiedBy._id": 1,
          "verifiedBy.name": 1,
          "verifiedBy.email": 1,
        },
      }
    );

    const crimes = await CrimeReportModel.aggregate(pipeline);

    res.status(ResponseCode.SUCCESS).json({
      message: "Crimes fetched successfully.",
      data: crimes,
    });
  } catch (error) {
    console.error("Error fetching crimes:", error);
    res
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error while fetching crimes." });
  }
};