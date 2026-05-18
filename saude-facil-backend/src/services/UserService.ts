import prisma from "../utils/prisma.js";

export class UserService {
  async updateProfile(userId: string, data: any) {
    // Lista de campos permitidos para atualização via perfil
    const allowedFields = [
      "name",
      "phone",
      "cep",
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "institutionName",
      "organizationName"
    ];

    const updateData: any = {};
    
    // Filtrar apenas campos permitidos e presentes nos dados
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        institutions: true,
        organization: true
      },
    });
  }

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        institutions: true,
        organization: true
      },
    });
  }
}

export default new UserService();
