import { Request, Response } from "express";
import CrimeReportModel from "../models/crimeReport.model.js";
import { ResponseCode } from "../utils/responseCode.enum.js";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import CrimeReport from "../interfaces/crimeReport.interface.js";

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
          maxDistance: 3000, // in meters
          spherical: true,
          query: { isVerified: true },
        },
      },
      {
        $lookup: {
          from: "users", // name of your user collection (usually lowercase plural of model)
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      {
        $unwind: "$reportedBy",
      },
      {
        $unset: "reportedBy.password", // ✅ removes password from populated user
      },
    ]);

    res
        .status(ResponseCode.INTERNAL_SERVER_ERROR)
        .json({ data: crimes, message: "Crimes Data Successfully Fetched" });
  } catch (err) {
    console.error("Error fetching nearby crimes:", err);
    res
        .status(ResponseCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error.!" });
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
        $match: { isVerified: false }, // 🔍 only unverified crimes
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
    const crimes = await CrimeReportModel.aggregate([
      {
        $match: { isVerified: true }, // 🔍 only unverified crimes
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

export const changeVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || typeof status !== "boolean") {
      res.status(ResponseCode.BAD_REQUEST).json({
        message: "Crime ID and status (boolean) are required",
      });
      return;
    }

    const crime = await CrimeReportModel.findByIdAndUpdate(
        id,
        { isVerified: status },
        { new: true }
    );

    if (!crime) {
      res.status(ResponseCode.NOT_FOUND).json({
        message: "Crime report not found",
      });
      return;
    }

    res.status(ResponseCode.SUCCESS).json({
      message: `Crime report has been ${
          status ? "verified" : "unverified"
      } successfully`,
      crime,
    });
  } catch (error: any) {
    console.error("Changing Verification Status Error:", error.message);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const getCrimeClusters = async (req: Request, res: Response) => {
  try {
    const radiusInMeters = 1000;
    const minClusterSize = 10;

    const allCrimes : CrimeReport[] = await CrimeReportModel.find({}, { location: 1 });

    const visited = new Set();
    const clusters: any[] = [];

    for (let i = 0; i < allCrimes.length; i++) {
      if (visited.has(allCrimes[i]._id.toString())) continue;

      const centerCrime = allCrimes[i];
      const nearbyCrimes = await CrimeReportModel.find({
        location: {
          $nearSphere: {
            $geometry: centerCrime.location,
            $maxDistance: radiusInMeters,
          },
        },
      });

      const clusterCrimes = nearbyCrimes.filter(c =>
          !visited.has(c._id.toString())
      );

      if (clusterCrimes.length >= minClusterSize) {
        clusterCrimes.forEach(c => visited.add(c._id.toString()));
        const avgLat =
            clusterCrimes.reduce((sum, c) => sum + c.location.coordinates[1], 0) /
            clusterCrimes.length;
        const avgLng =
            clusterCrimes.reduce((sum, c) => sum + c.location.coordinates[0], 0) /
            clusterCrimes.length;

        clusters.push({
          center: { lat: avgLat, lng: avgLng },
          count: clusterCrimes.length,
          crimes: clusterCrimes.map(c => ({
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};