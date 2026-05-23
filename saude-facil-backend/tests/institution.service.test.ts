import test from "node:test";
import assert from "node:assert/strict";
import { InstitutionService } from "../src/services/InstitutionService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("InstitutionService.getAll filtra por tipo", async () => {
  let capturedArgs: any = null;
  setPrismaModel("institution", {
    findMany: async (args: any) => {
      capturedArgs = args;
      return [];
    }
  });

  const service = new InstitutionService();
  await service.getAll({ type: "clinica" });

  assert.deepEqual(capturedArgs.where.AND[0], { type: "clinica" });
});

test("InstitutionService.getStats calcula receita corretamente", async () => {
  setPrismaModel("appointment", {
    count: async () => 10,
    findMany: async () => [
      { service: { price: 100 } },
      { service: { price: 50 } }
    ],
    groupBy: async () => []
  });

  setPrismaModel("service", {
    count: async () => 5
  });

  const service = new InstitutionService();
  const stats = await service.getStats("inst-1");

  assert.equal(stats.totalAppointments, 10);
  assert.equal(stats.monthlyRevenue, 150);
  assert.equal(stats.annualRevenue, 150);
  assert.equal(stats.servicesCount, 5);
});

test("InstitutionService.update filtra campos não permitidos", async () => {
  let capturedData: any = null;
  setPrismaModel("institution", {
    update: async (args: any) => {
      capturedData = args.data;
      return { id: "inst-1", ...args.data };
    }
  });

  const service = new InstitutionService();
  await service.update("inst-1", {
    name: "Nova Clínica",
    managerId: "hacker-id", // Não permitido
    secretField: "malicious" // Não permitido
  });

  assert.equal(capturedData.name, "Nova Clínica");
  assert.equal(capturedData.managerId, undefined);
  assert.equal(capturedData.secretField, undefined);
});
