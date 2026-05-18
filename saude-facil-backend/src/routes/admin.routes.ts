import { Router } from "express";
import AdminController from "../controllers/AdminController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["UA"]));

router.get("/users", AdminController.getUsers);
router.get("/users/:id", AdminController.getUserById);
router.patch("/users/:id/status", AdminController.toggleUserStatus);
router.delete("/users/:id", AdminController.deleteUser);
router.get("/institutions", AdminController.getInstitutions);
router.delete("/institutions/:id", AdminController.deleteInstitution);
router.get("/stats", AdminController.getStats);

export default router;
