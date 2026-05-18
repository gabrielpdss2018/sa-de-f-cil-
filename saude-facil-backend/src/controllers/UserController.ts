import { Response } from "express";
import UserService from "../services/UserService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.updateProfile(req.user!.userId, req.body);
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
