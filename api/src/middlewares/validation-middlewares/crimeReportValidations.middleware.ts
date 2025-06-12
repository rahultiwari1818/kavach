import { Request, Response, NextFunction } from 'express';
import { ResponseCode } from "../../utils/responseCode.enum"

export const crimeReportValidation =  (req: Request, res: Response, next: NextFunction) : void => {
  try {
    const { title, type, description, location, datetime, anonymous, reportedBy } = req.body;

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

    if (!location || typeof location !== 'string') {
       res.status(ResponseCode.BAD_REQUEST).json({ message: 'Location is required and must be a string.' });
       return;
    }

    if (!datetime || isNaN(Date.parse(datetime))) {
       res.status(ResponseCode.BAD_REQUEST).json({ message: 'Datetime is required and must be a valid date/time string.' });
       return;
    }

    if (typeof anonymous !== 'boolean') {
       res.status(ResponseCode.BAD_REQUEST).json({ message: 'Anonymous must be a boolean.' });
       return;
    }

    if (!reportedBy) {
       res.status(ResponseCode.BAD_REQUEST).json({ message: 'ReportedBy is required.' });
       return;
    }

    next(); // All validations passed
  } catch (error) {
    console.error('Error Occurred In Crime Report Validations:', error);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error during validation.' });
  }
};
