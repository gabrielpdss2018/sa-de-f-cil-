import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../src/services/AuthService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("AuthService.login retorna usuario sem senha e token JWT valido", async () => {
  const hashedPassword = await bcrypt.hash("123456", 8);
  setPrismaModel("user", {
    findUnique: async () => ({
      id: "user-1",
      email: "maria@email.com",
      name: "Maria",
      password: hashedPassword,
      role: "UC",
      active: true,
      institutions: [],
      organization: null,
    }),
  });

  const result = await new AuthService().login("maria@email.com", "123456");

  assert.equal(result.user.email, "maria@email.com");
  assert.equal((result.user as any).password, undefined);
  assert.equal(typeof result.token, "string");

  const decoded = jwt.verify(result.token, process.env.JWT_SECRET || "fallback_secret") as any;
  assert.equal(decoded.id, "user-1");
  assert.equal(decoded.role, "UC");
});

test("AuthService.login rejeita usuario inexistente", async () => {
  setPrismaModel("user", {
    findUnique: async () => null,
  });

  await assert.rejects(
    () => new AuthService().login("naoexiste@email.com", "123456"),
    /Usuario nao encontrado|Usu.rio n.o encontrado/,
  );
});

test("AuthService.login rejeita conta desativada", async () => {
  setPrismaModel("user", {
    findUnique: async () => ({
      id: "user-2",
      email: "bloqueado@email.com",
      name: "Bloqueado",
      password: "hash",
      role: "UC",
      active: false,
    }),
  });

  await assert.rejects(
    () => new AuthService().login("bloqueado@email.com", "123456"),
    /conta.*desativada/i,
  );
});

test("AuthService.login rejeita senha invalida", async () => {
  const hashedPassword = await bcrypt.hash("senha-correta", 8);
  setPrismaModel("user", {
    findUnique: async () => ({
      id: "user-3",
      email: "maria@email.com",
      name: "Maria",
      password: hashedPassword,
      role: "UC",
      active: true,
    }),
  });

  await assert.rejects(
    () => new AuthService().login("maria@email.com", "senha-errada"),
    /Senha inv.lida/,
  );
});

