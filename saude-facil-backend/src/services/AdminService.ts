import prisma from "../utils/prisma.js";

export class AdminService {
  async getAllUsers(filters: any = {}) {
    const { role, search } = filters;
    return prisma.user.findMany({
      where: {
        AND: [
          role && role !== "todos" ? { role } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
    });
  }

  async getAllInstitutions() {
    return prisma.institution.findMany({
      include: {
        manager: { select: { name: true, email: true } },
        _count: { select: { appointments: true, services: true } },
      },
    });
  }

  async toggleUserStatus(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    return prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });
  }

  async deleteUser(id: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Deletar agendamentos onde o usuário é paciente
      await tx.appointment.deleteMany({ where: { patientId: id } });

      // 2. Se o usuário for gestor de instituições, tratar instituições
      const institutions = await tx.institution.findMany({
        where: { managerId: id },
      });

      for (const inst of institutions) {
        // Limpeza profunda da instituição
        await tx.appointment.deleteMany({ where: { institutionId: inst.id } });
        await tx.availability.deleteMany({ where: { institutionId: inst.id } });
        const services = await tx.service.findMany({
          where: { institutionId: inst.id },
        });
        for (const s of services) {
          await tx.timeSlot.deleteMany({ where: { serviceId: s.id } });
        }
        await tx.service.deleteMany({ where: { institutionId: inst.id } });
      }

      await tx.institution.deleteMany({ where: { managerId: id } });

      // 3. Deletar o usuário
      return tx.user.delete({ where: { id } });
    });
  }

  async deleteInstitution(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.appointment.deleteMany({ where: { institutionId: id } });
      await tx.availability.deleteMany({ where: { institutionId: id } });
      const services = await tx.service.findMany({
        where: { institutionId: id },
      });
      for (const s of services) {
        await tx.timeSlot.deleteMany({ where: { serviceId: s.id } });
      }
      await tx.service.deleteMany({ where: { institutionId: id } });
      return tx.institution.delete({ where: { id } });
    });
  }

  async getGlobalStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const usersCount = await prisma.user.count();
    const institutionsCount = await prisma.institution.count();
    const appointmentsCount = await prisma.appointment.count();
    const completedCount = await prisma.appointment.count({
      where: { status: "concluido" },
    });

    // Métricas específicas por role (Apenas usuários ativos para cálculo financeiro de assinaturas)
    const ucCount = await prisma.user.count({ where: { role: "UC", active: true } });
    const upCount = await prisma.user.count({ where: { role: "UP", active: true } });
    const ueCount = await prisma.user.count({ where: { role: "UE", active: true } });

    // Cálculo de Receita de Agendamentos (Consultas finalizadas)
    const monthlyAppointments = await prisma.appointment.findMany({
      where: {
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

    // Lucro por Planos (Valores acumulados do ano até o mês atual)
    // UP (Parceiros/Clínicas): R$ 299,00/mês
    // UE (Empresas/Gestores): R$ 799,00/mês
    const currentMonthIndex = now.getMonth() + 1; // 1 para Jan, 5 para Mai, etc.
    const monthlyPlanRevenue = upCount * 299 + ueCount * 799;
    const annualPlanRevenue = monthlyPlanRevenue * currentMonthIndex;

    // Média de utilização (Agendamentos totais por Usuário Comum Ativo)
    const averageUsage =
      ucCount > 0 ? (appointmentsCount / ucCount).toFixed(2) : 0;

    return {
      usersCount,
      institutionsCount,
      appointmentsCount,
      completedCount,
      ucCount,
      upCount,
      ueCount,
      averageUsage,
      revenue: {
        monthly: monthlyRevenue,
        annual: annualRevenue,
        plansMonthly: monthlyPlanRevenue,
        plansAnnual: annualPlanRevenue,
        totalMonthly: monthlyRevenue + monthlyPlanRevenue,
        totalAnnual: annualRevenue + annualPlanRevenue,
      },
      growthRate: 15, // Mock growth
    };
  }
}

export default new AdminService();
