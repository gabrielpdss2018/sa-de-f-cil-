import { Router } from "express";
import InstitutionController from "../controllers/InstitutionController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", InstitutionController.getAll);
router.get("/:id", InstitutionController.getById);
router.get(
  "/:id/stats",
  authMiddleware,
  roleMiddleware(["UP", "UE", "UA"]),
  InstitutionController.getStats,
);
router.get(
  "/:id/availability",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  InstitutionController.getAvailability,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  InstitutionController.update,
);
router.post(
  "/:id/availability",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  InstitutionController.saveAvailability,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  InstitutionController.create,
);

export default router;
