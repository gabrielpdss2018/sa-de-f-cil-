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

