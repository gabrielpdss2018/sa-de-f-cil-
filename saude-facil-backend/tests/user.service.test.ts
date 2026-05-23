import test from "node:test";
import assert from "node:assert/strict";
import { UserService } from "../src/services/UserService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("UserService.getProfile retorna o perfil do usuário com relações", async () => {
  const mockUser = {
    id: "user-1",
    email: "test@test.com",
    name: "Test User",
    institutions: [],
    organization: null
  };

  setPrismaModel("user", {
    findUnique: async (args: any) => {
      assert.equal(args.where.id, "user-1");
      return mockUser;
    }
  });

  const service = new UserService();
  const profile = await service.getProfile("user-1");

  assert.deepEqual(profile, mockUser);
});

test("UserService.updateProfile filtra campos não permitidos", async () => {
  let capturedData: any = null;

  setPrismaModel("user", {
    update: async (args: any) => {
      capturedData = args.data;
      return { id: "user-1", ...args.data };
    }
  });

  const service = new UserService();
  await service.updateProfile("user-1", {
    name: "Novo Nome",
    phone: "123456",
    role: "ADMIN", // Campo não permitido no updateProfile do UserService
    active: false  // Campo não permitido
  });

  assert.equal(capturedData.name, "Novo Nome");
  assert.equal(capturedData.phone, "123456");
  assert.equal(capturedData.role, undefined);
  assert.equal(capturedData.active, undefined);
});
