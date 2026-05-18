import prisma from "../utils/prisma.js";

export class EnterpriseService {
  async getMyUnits(organizationId: string) {
    return prisma.institution.findMany({
      where: { organizationId },
      include: {
        _count: { select: { appointments: true, services: true } },
      },
    });
  }

  async getOrganizationAppointments(organizationId: string) {
    const units = await prisma.institution.findMany({
      where: { organizationId },
      select: { id: true },
    });

    const unitIds = units.map((u) => u.id);

    return prisma.appointment.findMany({
      where: { institutionId: { in: unitIds } },
      include: {
        patient: { select: { name: true } },
        institution: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });
  }

  async getLinkedUsers(organizationId: string) {
    return prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getConsolidatedStats(organizationId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const units = await prisma.institution.findMany({
      where: { organizationId },
      select: { id: true },
    });

    const unitIds = units.map((u) => u.id);

    const totalAppointments = await prisma.appointment.count({
      where: { institutionId: { in: unitIds } },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        institutionId: { in: unitIds },
        status: "concluido",
      },
    });

    // Receita Consolidada
    const monthlyApps = await prisma.appointment.findMany({
      where: {
        institutionId: { in: unitIds },
        status: "concluido",
        date: {
          gte: startOfMonth,
          lte: now,
        },
      },
      include: { service: { select: { price: true } } },
    });

    const annualApps = await prisma.appointment.findMany({
      where: {
        institutionId: { in: unitIds },
        status: "concluido",
        date: {
          gte: startOfYear,
          lte: now,
        },
      },
      include: { service: { select: { price: true } } },
    });

    const monthlyRevenue = monthlyApps.reduce(
      (sum, app) => sum + (app.service?.price || 0),
      0,
    );
    const annualRevenue = annualApps.reduce(
      (sum, app) => sum + (app.service?.price || 0),
      0,
    );

    return {
      totalUnits: units.length,
      totalAppointments,
      completedAppointments,
      monthlyRevenue,
      annualRevenue,
      performance: 88, // Mock performance
    };
  }
}

export default new EnterpriseService();
