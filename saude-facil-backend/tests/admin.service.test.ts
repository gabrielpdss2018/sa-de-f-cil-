import test from "node:test";
import assert from "node:assert/strict";
import { AdminService } from "../src/services/AdminService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("AdminService.toggleUserStatus inverte status ativo do usuario", async () => {
  const updates: any[] = [];

  setPrismaModel("user", {
    findUnique: async (args: any) => {
      assert.deepEqual(args, { where: { id: "user-1" } });
      return { id: "user-1", active: false };
    },
    update: async (args: any) => {
      updates.push(args);
      return { id: "user-1", active: args.data.active };
    },
  });

  const result = await new AdminService().toggleUserStatus("user-1");

  assert.equal(result.active, true);
  assert.deepEqual(updates[0], {
    where: { id: "user-1" },
    data: { active: true },
  });
});

test("AdminService.toggleUserStatus falha quando usuario nao existe", async () => {
  setPrismaModel("user", {
    findUnique: async () => null,
  });

  await assert.rejects(
    () => new AdminService().toggleUserStatus("missing"),
    /Usuario nao encontrado|Usu.rio n.o encontrado/,
  );
});

test("AdminService.getGlobalStats calcula receita e contagem corretamente", async () => {
  setPrismaModel("user", {
    count: async () => 100,
  });
  setPrismaModel("institution", {
    count: async () => 20,
  });
  setPrismaModel("appointment", {
    count: async () => 300,
    findMany: async () => [
      { service: { price: 200 } },
      { service: { price: 300 } }
    ]
  });

  const service = new AdminService();
  const stats = await service.getGlobalStats();

  assert.equal(stats.usersCount, 100);
  assert.equal(stats.institutionsCount, 20);
  assert.equal(stats.revenue.monthly, 500);
  assert.ok(stats.averageUsage > 0);
});

test("AdminService.deleteUser limpa dados vinculados em transacao", async () => {
  const calls: string[] = [];
  
  const tx = {
    appointment: { deleteMany: async () => { calls.push("app.delete"); return { count: 1 }; } },
    institution: { 
      findMany: async () => [{ id: "inst-1" }],
      deleteMany: async () => { calls.push("inst.delete"); return { count: 1 }; } 
    },
    service: { findMany: async () => [{ id: "srv-1" }], deleteMany: async () => { calls.push("srv.delete"); return { count: 1 }; } },
    availability: { deleteMany: async () => { calls.push("avail.delete"); return { count: 1 }; } },
    timeSlot: { deleteMany: async () => { calls.push("slot.delete"); return { count: 1 }; } },
    user: { delete: async () => { calls.push("user.delete"); return { id: "u1" }; } }
  };

  const { setPrismaMethod } = await import("./helpers/prismaMock.js");
  setPrismaMethod("$transaction", async (callback: any) => callback(tx));

  const service = new AdminService();
  await service.deleteUser("u1");

  assert.ok(calls.includes("user.delete"));
  assert.ok(calls.includes("app.delete"));
});


