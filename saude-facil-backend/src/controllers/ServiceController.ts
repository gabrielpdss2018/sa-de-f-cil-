import { Request, Response } from "express";
import ServiceService from "../services/ServiceService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class ServiceController {
  async create(req: AuthRequest, res: Response) {
    try {
      // Simplificado: assume que o usuário tem uma instituição ou envia no body
      const { institutionId } = req.body;
      const service = await ServiceService.create(req.body, institutionId);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const service = await ServiceService.update(
        req.params.id as string,
        req.body,
      );
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await ServiceService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByInstitution(req: Request, res: Response) {
    try {
      const services = await ServiceService.getByInstitution(
        req.params.institutionId as string,
      );
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      // Re-implementando getById que foi removido acidentalmente
      const service = await ServiceService.getById(req.params.id as string);
      if (!service)
        return res.status(404).json({ error: "Serviço não encontrado" });
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ServiceController();
