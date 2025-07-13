import { Router } from "express";
import { changeVerificationStatus, crimeReportController, getAllUnverifiedCrimes, getMyCrimeReports, getNearbyCrimes } from "../controllers/crimeReport.controllers.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import { crimeReportValidation } from "../middlewares/validation-middlewares/crimeReportValidations.middleware.js";
import upload from "../middlewares/multer-file-upload/file_upload.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
const router = Router();
// ----------------------------------------------- User Crime Routes ------------------------------------------------
router.post("/report-crime", upload.array("media"), verifyUser, crimeReportValidation, crimeReportController);
router.get("/nearby", verifyUser, getNearbyCrimes);
router.get("/my-reports", verifyUser, getMyCrimeReports);
// --------------------------------------------------- Admin Crime Routes ------------------------------------------------------
router.get("/getAllUnverifiedCrimes", verifyAdmin, getAllUnverifiedCrimes);
router.patch("/:id/verify", verifyAdmin, changeVerificationStatus);
export default router;
//# sourceMappingURL=crimeReport.routes.js.map