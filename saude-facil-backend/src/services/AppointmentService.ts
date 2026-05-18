import prisma from "../utils/prisma.js";
import { AppointmentStatus } from "../utils/prisma.js";

export class AppointmentService {
  async create(data: any, patientId: string) {
    const { date, time, institutionId, serviceId } = data;

    // Iniciar transação para garantir atomicidade
    return prisma.$transaction(async (tx) => {
      // 1. Criar o agendamento
      const appointment = await tx.appointment.create({
        data: {
          date: new Date(date),
          time,
          status: AppointmentStatus.agendado,
          patientId,
          institutionId,
          serviceId,
        },
        include: {
          institution: true,
          service: true,
        },
      });

      // 2. Marcar o slot como indisponível
      // Nota: No mundo real, você usaria o ID do slot, mas aqui buscamos por data/hora/serviço
      await tx.timeSlot.updateMany({
        where: {
          serviceId,
          date: new Date(date),
          time,
          available: true,
        },
        data: { available: false },
      });

      return appointment;
    });
  }

  async getByPatient(patientId: string) {
    return prisma.appointment.findMany({
      where: { patientId },
      include: {
        institution: true,
        service: true,
      },
      orderBy: { date: "desc" },
    });
  }

  async getByInstitution(institutionId: string) {
    return prisma.appointment.findMany({
      where: { institutionId },
      include: {
        patient: {
          select: { name: true, email: true, phone: true },
        },
        service: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.appointment.update({
      where: { id },
      data: { status: status as AppointmentStatus },
    });
  }
}

export default new AppointmentService();
