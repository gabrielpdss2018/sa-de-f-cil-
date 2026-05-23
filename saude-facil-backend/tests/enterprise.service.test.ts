import test from "node:test";
import assert from "node:assert/strict";
import { EnterpriseService } from "../src/services/EnterpriseService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("EnterpriseService.getConsolidatedStats calcula totais de múltiplas unidades", async () => {
  setPrismaModel("institution", {
    findMany: async () => [{ id: "unit-1" }, { id: "unit-2" }]
  });

  setPrismaModel("appointment", {
    count: async () => 50,
    findMany: async () => [
      { service: { price: 200 } },
      { service: { price: 300 } }
    ]
  });

  const service = new EnterpriseService();
  const stats = await service.getConsolidatedStats("org-1");

  assert.equal(stats.totalUnits, 2);
  assert.equal(stats.totalAppointments, 50);
  assert.equal(stats.monthlyRevenue, 500);
});

test("EnterpriseService.getLinkedUsers retorna usuários da organização", async () => {
  let capturedWhere: any = null;
  setPrismaModel("user", {
    findMany: async (args: any) => {
      capturedWhere = args.where;
      return [{ id: "u1", name: "User 1" }];
    }
  });

  const service = new EnterpriseService();
  await service.getLinkedUsers("org-123");

  assert.equal(capturedWhere.organizationId, "org-123");
});
