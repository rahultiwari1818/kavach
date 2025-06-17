import { Request, Response, NextFunction } from 'express';
import { ResponseCode } from "../../utils/responseCode.enum";

export const crimeReportValidation = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, type, description, latitude, longitude, datetime, anonymous } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Title is required and must be a string.' });
      return;
    }

    if (!type || typeof type !== 'string') {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Type is required and must be a string.' });
      return;
    }

    if (!description || typeof description !== 'string') {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Description is required and must be a string.' });
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Latitude and Longitude must be valid coordinates.' });
      return;
    }

    if (!datetime || isNaN(Date.parse(datetime))) {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Datetime is required and must be a valid date/time string.' });
      return;
    }

    if (anonymous !== "true" && anonymous !== "false") {
      res.status(ResponseCode.BAD_REQUEST).json({ message: 'Anonymous must be "true" or "false".' });
      return;
    }

    next(); // ✅ All validations passed
  } catch (error) {
    console.error('Error Occurred In Crime Report Validations:', error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error during validation.' });
  }
};
