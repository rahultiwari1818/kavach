import { Router } from "express"; 
import { crimeReportController } from "../controllers/crimeReport.controller";

const router = Router();

router.post("/report-crime",crimeReportController)

export default router;