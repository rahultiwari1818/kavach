import express from "express";
import { getAllAuditLogsController } from "../controllers/auditLog.controllers.js";
import { verifySuperAdmin } from "../middlewares/verifySuperAdmin.middleware.js";

const router = express.Router();

// Only admins or super admins can access logs
router.get("/get-all", verifySuperAdmin, getAllAuditLogsController);

export default router;
