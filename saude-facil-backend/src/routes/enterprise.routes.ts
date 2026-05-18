import { Router } from "express";
import EnterpriseController from "../controllers/EnterpriseController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["UE"]));

router.get("/units", EnterpriseController.getUnits);
router.get("/appointments", EnterpriseController.getAppointments);
router.get("/users", EnterpriseController.getUsers);
router.get("/stats", EnterpriseController.getStats);

export default router;
