import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["UC"]), AppointmentController.create);
router.get(
  "/my",
  roleMiddleware(["UC"]),
  AppointmentController.getMyAppointments,
);
router.get(
  "/institution/:institutionId",
  roleMiddleware(["UP", "UE", "UA"]),
  AppointmentController.getInstitutionAppointments,
);
router.patch(
  "/:id/status",
  roleMiddleware(["UC", "UP", "UA"]),
  AppointmentController.updateStatus,
);

export default router;
