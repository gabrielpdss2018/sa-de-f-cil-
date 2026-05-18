import { Response } from "express";
import AdminService from "../services/AdminService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class AdminController {
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await AdminService.getAllUsers(req.query);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const user = await AdminService.getUserById(req.params.id as string);
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInstitutions(req: AuthRequest, res: Response) {
    try {
      const institutions = await AdminService.getAllInstitutions();
      res.json(institutions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async toggleUserStatus(req: AuthRequest, res: Response) {
    try {
      const user = await AdminService.toggleUserStatus(req.params.id as string);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      await AdminService.deleteUser(req.params.id as string);
      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteInstitution(req: AuthRequest, res: Response) {
    try {
      await AdminService.deleteInstitution(req.params.id as string);
      res.json({ message: "Instituição excluída com sucesso" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await AdminService.getGlobalStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AdminController();
