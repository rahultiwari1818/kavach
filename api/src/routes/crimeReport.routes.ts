import { Router } from "express"; 
import { changeVerificationStatus, crimeReportController, getAllUnverifiedCrimes, getAllverifiedCrimes, getCrimeClusters, getMyCrimeReports, getNearbyCrimes } from "../controllers/crimeReport.controllers.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import { crimeReportValidation } from "../middlewares/validation-middlewares/crimeReportValidations.middleware.js";
import upload from "../middlewares/multer-file-upload/file_upload.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

// ----------------------------------------------- User Crime Routes ------------------------------------------------

router.post("/report-crime",upload.array("media"),verifyUser,crimeReportValidation,crimeReportController);

router.get("/nearby",verifyUser, getNearbyCrimes); 

router.get("/my-reports",verifyUser,getMyCrimeReports)

router.get("/clusters",verifyUser,getCrimeClusters)




// --------------------------------------------------- Admin Crime Routes ------------------------------------------------------

router.get("/getAllUnverifiedCrimes",verifyAdmin,getAllUnverifiedCrimes);
router.get("/getAllverifiedCrimes",verifyAdmin,getAllverifiedCrimes);

router.patch("/:id/verify",verifyAdmin,changeVerificationStatus);





export default router;