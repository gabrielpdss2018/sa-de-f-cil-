import prisma from "../utils/prisma.js";

export class InstitutionService {
  async getAll(filters: any) {
    const { type, search } = filters;

    return prisma.institution.findMany({
      where: {
        AND: [
          type ? { type } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" as any } },
                  { street: { contains: search, mode: "insensitive" as any } },
                  { city: { contains: search, mode: "insensitive" as any } },
                ],
              }
            : {},
        ],
      },
      include: {
        services: true,
      },
    });
  }

  async getById(id: string) {
    return prisma.institution.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });
  }

  async create(data: any, managerId: string) {
    return prisma.institution.create({
      data: {
        ...data,
        managerId,
      },
    });
  }

  async update(id: string, data: any) {
    const allowedFields = [
      "name",
      "type",
      "cep",
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "phone",
      "description",
      "specialties",
      "image"
    ];

    const updateData: any = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    return prisma.institution.update({
      where: { id },
      data: updateData,
    });
  }

  async getStats(id: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const totalAppointments = await prisma.appointment.count({
      where: { institutionId: id },
    });
    const completedAppointments = await prisma.appointment.count({
      where: { institutionId: id, status: "concluido" },
    });
    const scheduledAppointments = await prisma.appointment.count({
      where: { institutionId: id, status: "agendado" },
    });

    const servicesCount = await prisma.service.count({
      where: { institutionId: id },
    });

    // Receita (Apenas concluídos)
    const monthlyAppointments = await prisma.appointment.findMany({
      where: {
        institutionId: id,
        status: "concluido",
        date: {
          gte: startOfMonth,
          lte: now,
        },
      },
      include: { service: { select: { price: true } } },
    });

    const annualAppointments = await prisma.appointment.findMany({
      where: {
        institutionId: id,
        status: "concluido",
        date: {
          gte: startOfYear,
          lte: now,
        },
      },
      include: { service: { select: { price: true } } },
    });

    const monthlyRevenue = monthlyAppointments.reduce(
      (sum, app) => sum + (app.service?.price || 0),
      0,
    );
    const annualRevenue = annualAppointments.reduce(
      (sum, app) => sum + (app.service?.price || 0),
      0,
    );

    // Agrupamento por serviço
    const appointmentsByService = await prisma.appointment.groupBy({
      by: ["serviceId"],
      where: { institutionId: id },
      _count: { id: true },
    });

    return {
      totalAppointments,
      completedAppointments,
      scheduledAppointments,
      servicesCount,
      monthlyRevenue,
      annualRevenue,
      appointmentsByService,
    };
  }

  async saveAvailability(institutionId: string, rules: any[]) {
    return prisma.$transaction(async (tx) => {
      // Remover antigas
      await tx.availability.deleteMany({ where: { institutionId } });

      // Criar novas
      return tx.availability.createMany({
        data: rules.map((r) => ({
          ...r,
          institutionId,
        })),
      });
    });
  }

  async getAvailability(institutionId: string) {
    return prisma.availability.findMany({
      where: { institutionId },
    });
  }
}

export default new InstitutionService();
