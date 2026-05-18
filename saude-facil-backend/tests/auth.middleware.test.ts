import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { authMiddleware, roleMiddleware } from "../src/middlewares/auth.js";

function createResponse() {
  const response: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return response;
}

test("authMiddleware rejeita requisicao sem token", () => {
  const req: any = { headers: {} };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: "Token não fornecido" });
  assert.equal(nextCalled, false);
});

test("authMiddleware aceita token valido e popula req.user", () => {
  const token = jwt.sign(
    { userId: "user-1", role: "UA" },
    process.env.JWT_SECRET || "fallback_secret",
  );
  const req: any = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.userId, "user-1");
  assert.equal(req.user.role, "UA");
});

test("roleMiddleware libera perfil permitido", () => {
  const req: any = { user: { userId: "user-1", role: "UA" } };
  const res = createResponse();
  let nextCalled = false;

  roleMiddleware(["UA"])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test("roleMiddleware bloqueia perfil nao autorizado", () => {
  const req: any = { user: { userId: "user-1", role: "UC" } };
  const res = createResponse();
  let nextCalled = false;

  roleMiddleware(["UA"])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { error: "Acesso negado" });
});
