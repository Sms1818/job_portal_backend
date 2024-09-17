import { Router } from "express";
import { applyJob, getApplications } from "../controllers/applicationController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router=Router();

router.post("/:jobId",authenticateToken,checkRole('Candidate'),applyJob)
router.get("/:jobId",authenticateToken,checkRole('Company'),getApplications)

export default router;