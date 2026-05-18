import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/profile", authMiddleware, UserController.getProfile);
router.patch("/profile", authMiddleware, UserController.updateProfile);

export default router;
