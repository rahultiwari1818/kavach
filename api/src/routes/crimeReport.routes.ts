import { Router } from "express"; 
import { changeVerificationStatus, crimeReportController, getAllUnverifiedCrimes, getMyCrimeReports, getNearbyCrimes } from "../controllers/crimeReport.controllers";
import { verifyUser } from "../middlewares/verifyUser.middleware";
import { crimeReportValidation } from "../middlewares/validation-middlewares/crimeReportValidations.middleware";
import upload from "../middlewares/multer-file-upload/file_upload.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

const router = Router();

// ----------------------------------------------- User Crime Routes ------------------------------------------------

router.post("/report-crime",upload.array("media"),verifyUser,crimeReportValidation,crimeReportController);

router.get("/nearby",verifyUser, getNearbyCrimes); 

router.get("/my-reports",verifyUser,getMyCrimeReports)


// --------------------------------------------------- Admin Crime Routes ------------------------------------------------------

router.get("/getAllUnverifiedCrimes",verifyAdmin,getAllUnverifiedCrimes);

router.patch("/:id/verify",verifyAdmin,changeVerificationStatus);


export default router;