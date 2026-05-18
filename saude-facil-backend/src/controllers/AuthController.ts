import { Response } from "express";
import AuthService from "../services/AuthService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new Error("Não autorizado");

      const user = await AuthService.updateProfile(userId, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async forgotPassword(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;
      const token = await AuthService.requestPasswordReset(email);
      res.json({ message: "Instruções de recuperação enviadas.", token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req: AuthRequest, res: Response) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      res.json({ message: "Senha redefinida com sucesso." });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
