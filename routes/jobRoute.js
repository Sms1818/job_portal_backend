import { Router } from "express";
import { deleteJob, getJobDetails, getJobDetailsById, getJobDetailsforSpecificCompany, postJob, updateJobDetails } from "../controllers/jobController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, checkRole('Company'), postJob);

router.get("/", authenticateToken, getJobDetails);

router.get("/:id",authenticateToken, getJobDetailsById);
router.get("/company/:userId",authenticateToken,getJobDetailsforSpecificCompany);

router.patch("/:id",authenticateToken,checkRole('Company'),updateJobDetails)

router.delete("/:id",authenticateToken,checkRole('Company'),deleteJob)

export default router;
