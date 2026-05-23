import test from "node:test";
import assert from "node:assert/strict";
import { AppointmentService } from "../src/services/AppointmentService.js";
import { setPrismaMethod } from "./helpers/prismaMock.js";

test("AppointmentService.create cria agendamento e bloqueia horario na mesma transacao", async () => {
  const calls: string[] = [];
  const tx = {
    appointment: {
      create: async (args: any) => {
        calls.push("appointment.create");
        assert.equal(args.data.patientId, "patient-1");
        assert.equal(args.data.institutionId, "inst-1");
        assert.equal(args.data.serviceId, "service-1");
        assert.equal(args.data.time, "08:30");
        assert.equal(args.data.status, "agendado");
        assert.ok(args.data.date instanceof Date);
        return { id: "appointment-1", ...args.data };
      },
    },
    timeSlot: {
      updateMany: async (args: any) => {
        calls.push("timeSlot.updateMany");
        assert.equal(args.where.serviceId, "service-1");
        assert.equal(args.where.time, "08:30");
        assert.equal(args.where.available, true);
        assert.deepEqual(args.data, { available: false });
        return { count: 1 };
      },
    },
  };

  setPrismaMethod("$transaction", async (callback: any) => callback(tx));

  const result = await new AppointmentService().create(
    {
      date: "2026-05-20",
      time: "08:30",
      institutionId: "inst-1",
      serviceId: "service-1",
    },
    "patient-1",
  );

  assert.equal(result.id, "appointment-1");
  assert.deepEqual(calls, ["appointment.create", "timeSlot.updateMany"]);
});

test("AppointmentService.cancel restaura horario e muda status do agendamento", async () => {
  const calls: string[] = [];
  const mockAppointment = {
    id: "app-1",
    serviceId: "srv-1",
    time: "10:00",
    date: new Date()
  };

  const tx = {
    appointment: {
      findUnique: async () => mockAppointment,
      update: async (args: any) => {
        calls.push("appointment.update");
        assert.equal(args.data.status, "cancelado");
        return { ...mockAppointment, status: "cancelado" };
      }
    },
    timeSlot: {
      updateMany: async (args: any) => {
        calls.push("timeSlot.updateMany");
        assert.equal(args.where.serviceId, "srv-1");
        assert.equal(args.where.time, "10:00");
        assert.equal(args.data.available, true);
        return { count: 1 };
      }
    }
  };

  setPrismaMethod("$transaction", async (callback: any) => callback(tx));

  const service = new AppointmentService();
  await service.cancel("app-1");

  assert.deepEqual(calls, ["appointment.update", "timeSlot.updateMany"]);
});


