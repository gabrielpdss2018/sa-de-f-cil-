import { Request, Response } from "express";
import InstitutionService from "../services/InstitutionService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class InstitutionController {
  async getAll(req: Request, res: Response) {
    try {
      const institutions = await InstitutionService.getAll(req.query);
      res.json(institutions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const institution = await InstitutionService.getById(
        req.params.id as string,
      );
      if (!institution)
        return res.status(404).json({ error: "Instituição não encontrada" });
      res.json(institution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const institution = await InstitutionService.create(
        req.body,
        req.user!.userId,
      );
      res.status(201).json(institution);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const institution = await InstitutionService.update(
        req.params.id as string,
        req.body,
      );
      res.json(institution);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await InstitutionService.getStats(req.params.id as string);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async saveAvailability(req: AuthRequest, res: Response) {
    try {
      const result = await InstitutionService.saveAvailability(
        req.params.id as string,
        req.body,
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAvailability(req: AuthRequest, res: Response) {
    try {
      const result = await InstitutionService.getAvailability(
        req.params.id as string,
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new InstitutionController();
