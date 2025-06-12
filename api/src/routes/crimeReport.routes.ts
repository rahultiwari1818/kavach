import { Router } from "express"; 
import { crimeReportController } from "../controllers/crimeReport.controllers";
import { verifyUser } from "../middlewares/verifyUser.middleware";
import { crimeReportValidation } from "../middlewares/validation-middlewares/crimeReportValidations.middleware";

const router = Router();

router.post("/report-crime",verifyUser,crimeReportValidation,crimeReportController);


export default router;