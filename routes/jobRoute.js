import { Router } from "express";
import { getJobDetails, postJob } from "../controllers/jobController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/postjob", authenticateToken, checkRole('Company'), postJob);

router.get("/jobs", authenticateToken, getJobDetails);

export default router;
