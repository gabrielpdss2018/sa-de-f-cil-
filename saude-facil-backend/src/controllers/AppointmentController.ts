import { Response } from "express";
import AppointmentService from "../services/AppointmentService.js";
import { AuthRequest } from "../middlewares/auth.js";

export class AppointmentController {
  async create(req: AuthRequest, res: Response) {
    try {
      const appointment = await AppointmentService.create(
        req.body,
        req.user!.userId,
      );
      res.status(201).json(appointment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyAppointments(req: AuthRequest, res: Response) {
    try {
      const appointments = await AppointmentService.getByPatient(
        req.user!.userId,
      );
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInstitutionAppointments(req: AuthRequest, res: Response) {
    try {
      // Simplificado: assume que o usuário tem apenas uma instituição ou passa via query
      const { institutionId } = req.params;
      const appointments = await AppointmentService.getByInstitution(
        institutionId as string,
      );
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await AppointmentService.updateStatus(
        id as string,
        status,
      );
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
