import { Router } from "express"; 
import { crimeReportController, getNearbyCrimes } from "../controllers/crimeReport.controllers";
import { verifyUser } from "../middlewares/verifyUser.middleware";
import { crimeReportValidation } from "../middlewares/validation-middlewares/crimeReportValidations.middleware";
import upload from "../middlewares/multer-file-upload/file_upload.middleware";

const router = Router();

router.post("/report-crime",upload.array("media"),verifyUser,crimeReportValidation,crimeReportController);

router.get("/nearby",verifyUser, getNearbyCrimes); 



export default router;