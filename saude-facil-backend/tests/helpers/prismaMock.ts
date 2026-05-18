import prisma from "../../src/utils/prisma.js";

export const mockPrisma = prisma as any;

export function setPrismaModel(name: string, implementation: Record<string, unknown>) {
  Object.defineProperty(mockPrisma, name, {
    value: implementation,
    configurable: true,
  });
}

export function setPrismaMethod(name: string, implementation: unknown) {
  Object.defineProperty(mockPrisma, name, {
    value: implementation,
    configurable: true,
  });
}

