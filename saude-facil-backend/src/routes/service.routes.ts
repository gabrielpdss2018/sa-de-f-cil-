import { Router } from "express";
import ServiceController from "../controllers/ServiceController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/:id", ServiceController.getById);
router.get("/institution/:institutionId", ServiceController.getByInstitution);

// Gerenciamento (Apenas UP e UA)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  ServiceController.create,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  ServiceController.update,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["UP", "UA"]),
  ServiceController.delete,
);

export default router;
