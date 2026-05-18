import prisma from "../utils/prisma.js";

export class ServiceService {
  async create(data: any, institutionId: string) {
    return prisma.service.create({
      data: {
        ...data,
        institutionId,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // Primeiro deletar slots e agendamentos relacionados se necessário,
    // ou apenas marcar como inativo. Por simplicidade, vamos deletar.
    await prisma.timeSlot.deleteMany({ where: { serviceId: id } });
    return prisma.service.delete({
      where: { id },
    });
  }

  async getByInstitution(institutionId: string) {
    return prisma.service.findMany({
      where: { institutionId },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
    });
  }

  async getById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        institution: true,
        timeSlots: {
          where: { available: true },
          orderBy: [{ date: "asc" }, { time: "asc" }],
        },
      },
    });
  }
}

export default new ServiceService();
