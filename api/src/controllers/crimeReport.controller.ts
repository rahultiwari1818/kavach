import { Request,Response } from "express";
import { ResponseCode } from "../utils/responseCode.enum";

export const crimeReportController = async(req:Request,res:Response) : Promise<void>=>{
    try {
        
    } catch (error) {
        console.error("Crime Reporting Error:", error);
            res
              .status(ResponseCode.INTERNAL_SERVER_ERROR)
              .json({ message: "Internal Server Error" });
    }
}
