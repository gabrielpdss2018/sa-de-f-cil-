import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { UserRole } from "../utils/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export class AuthService {
  async register(data: any) {
    const { email, password, name, role, organizationName, cnpj, ...rest } =
      data;

    const hashedPassword = await bcrypt.hash(password, 8);

    return prisma.$transaction(async (tx) => {
      // Verificar se email já existe
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Este e-mail já está cadastrado.");

      // Verificar CPF se fornecido
      if (rest.cpf) {
        const existingCpf = await tx.user.findUnique({
          where: { cpf: rest.cpf },
        });
        if (existingCpf) throw new Error("Este CPF já está cadastrado.");
      }

      let organizationId = null;

      // Se for UE, cria uma organização automaticamente
      if (role === "UE" && organizationName) {
        const org = await tx.organization.create({
          data: {
            name: organizationName,
            cnpj: cnpj || `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        });
        organizationId = org.id;
      }

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role as UserRole,
          organizationName,
          cnpj,
          organizationId,
          active: true,
          cep: rest.cep,
          street: rest.street,
          number: rest.number,
          neighborhood: rest.neighborhood,
          city: rest.city,
          state: rest.state,
          phone: rest.phone,
          cpf: rest.cpf,
        },
      });

      // Se for UP, cria uma instituição automaticamente vinculada ao usuário
      if (role === "UP" && data.institutionName) {
        await tx.institution.create({
          data: {
            name: data.institutionName,
            cnpj: cnpj || `INST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: "clinica",
            cep: rest.cep || "",
            street: rest.street || "",
            number: rest.number || "",
            neighborhood: rest.neighborhood || "",
            city: rest.city || "",
            state: rest.state || "",
            phone: rest.phone || "Telefone não informado",
            managerId: user.id,
          },
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        institutions: {
          select: { id: true, name: true },
        },
        organization: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.active) {
      throw new Error(
        "Esta conta está desativada. Entre em contato com o suporte.",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Falha de login para ${email}: Senha incorreta`);
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async updateProfile(userId: string, data: any) {
    const { password, email, role, ...updates } = data;

    // Se houver nova senha, hashear
    if (password) {
      updates.password = await bcrypt.hash(password, 8);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const token = Math.random().toString(36).substr(2, 10);
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    return token;
  }

  async resetPassword(token: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gte: new Date() },
      },
    });

    if (!user) throw new Error("Token inválido ou expirado");

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
}

export default new AuthService();
