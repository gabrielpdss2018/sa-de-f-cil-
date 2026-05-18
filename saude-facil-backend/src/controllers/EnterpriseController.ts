import { Response } from "express";
import EnterpriseService from "../services/EnterpriseService.js";
import UserService from "../services/UserService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class EnterpriseController {
  async getUnits(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      if (!user?.organizationId)
        return res
          .status(403)
          .json({ error: "Usuário não vinculado a uma organização" });

      const units = await EnterpriseService.getMyUnits(user.organizationId);
      res.json(units);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAppointments(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      if (!user?.organizationId)
        return res
          .status(403)
          .json({ error: "Usuário não vinculado a uma organização" });

      const appointments = await EnterpriseService.getOrganizationAppointments(
        user.organizationId,
      );
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUsers(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      if (!user?.organizationId)
        return res
          .status(403)
          .json({ error: "Usuário não vinculado a uma organização" });

      const users = await EnterpriseService.getLinkedUsers(user.organizationId);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      if (!user?.organizationId)
        return res
          .status(403)
          .json({ error: "Usuário não vinculado a uma organização" });

      const stats = await EnterpriseService.getConsolidatedStats(
        user.organizationId,
      );
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new EnterpriseController();
