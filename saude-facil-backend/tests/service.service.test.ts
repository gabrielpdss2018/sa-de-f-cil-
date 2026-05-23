import test from "node:test";
import assert from "node:assert/strict";
import { ServiceService } from "../src/services/ServiceService.js";
import { setPrismaModel } from "./helpers/prismaMock.js";

test("ServiceService.create vincula servico a instituicao", async () => {
  setPrismaModel("service", {
    create: async (args: any) => {
      assert.deepEqual(args, {
        data: {
          name: "Consulta Clinica",
          price: 120,
          institutionId: "inst-1",
        },
      });
      return { id: "service-1", ...args.data };
    },
  });

  const result = await new ServiceService().create(
    { name: "Consulta Clinica", price: 120 },
    "inst-1",
  );

  assert.equal(result.id, "service-1");
  assert.equal(result.institutionId, "inst-1");
});

test("ServiceService.delete remove horarios antes de deletar servico", async () => {
  const calls: string[] = [];

  setPrismaModel("timeSlot", {
    deleteMany: async (args: any) => {
      calls.push("timeSlot.deleteMany");
      assert.deepEqual(args, { where: { serviceId: "service-1" } });
      return { count: 2 };
    },
  });
  setPrismaModel("service", {
    delete: async (args: any) => {
      calls.push("service.delete");
      assert.deepEqual(args, { where: { id: "service-1" } });
      return { id: "service-1" };
    },
  });

  const result = await new ServiceService().delete("service-1");

  assert.equal(result.id, "service-1");
  assert.deepEqual(calls, ["timeSlot.deleteMany", "service.delete"]);
});

test("ServiceService.getById retorna servico com timeSlots disponiveis", async () => {
  let capturedWhere: any = null;
  setPrismaModel("service", {
    findUnique: async (args: any) => {
      capturedWhere = args.include.timeSlots.where;
      return { id: "s1", name: "Servico", timeSlots: [] };
    }
  });

  const service = new ServiceService();
  await service.getById("s1");

  assert.equal(capturedWhere.available, true);
});

test("ServiceService.getByInstitution retorna todos os servicos da instituicao", async () => {
  let capturedWhere: any = null;
  setPrismaModel("service", {
    findMany: async (args: any) => {
      capturedWhere = args.where;
      return [];
    }
  });

  const service = new ServiceService();
  await service.getByInstitution("inst-1");

  assert.equal(capturedWhere.institutionId, "inst-1");
});


