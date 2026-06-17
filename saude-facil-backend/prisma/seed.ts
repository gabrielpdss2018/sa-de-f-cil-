import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Limpar dados existentes
  await prisma.appointment.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  // 2. Criar Organização (para UE)
  const org = await prisma.organization.create({
    data: {
      name: 'Rede Saúde Pantanal',
      cnpj: '99.888.777/0001-66',
      address: 'Centro, Cáceres-MT',
      phone: '(65) 3223-9000'
    }
  });

  // 3. Criar Usuários
  const userUC = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      email: 'maria@email.com',
      password,
      role: UserRole.UC,
      cpf: '123.456.789-00',
      phone: '(65) 99999-0001',
      cep: '78200-000',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'Cáceres',
      state: 'MT'
    },
  });

  const userUP = await prisma.user.create({
    data: {
      name: 'Dr. João Santos',
      email: 'joao@clinica.com',
      password,
      role: UserRole.UP,
      cpf: '987.654.321-00',
      cnpj: '12.345.678/0001-90',
      phone: '(65) 3223-4567',
      institutionName: 'Clínica São Lucas',
      cep: '78200-000',
      street: 'Av. Getúlio Vargas',
      number: '456',
      neighborhood: 'Centro',
      city: 'Cáceres',
      state: 'MT'
    },
  });

  const userUE = await prisma.user.create({
    data: {
      name: 'Ana Paula Costa',
      email: 'ana@empresa.com',
      password,
      role: UserRole.UE,
      cpf: '456.789.123-00',
      cnpj: '98.765.432/0001-10',
      organizationName: 'Rede Saúde Pantanal',
      organizationId: org.id
    },
  });

  const userUA = await prisma.user.create({
    data: {
      name: 'Carlos Admin',
      email: 'admin@saudefacil.com',
      password,
      role: UserRole.UA,
      phone: '(65) 3223-0000'
    },
  });

  // 4. Criar Instituições vinculadas à Organização
  const inst1 = await prisma.institution.create({
    data: {
      name: "Clínica São Lucas",
      cnpj: "12.345.678/0001-90",
      type: "clinica",
      cep: "78200-000",
      street: "Av. Getúlio Vargas",
      number: "456",
      neighborhood: "Centro",
      city: "Cáceres",
      state: "MT",
      phone: "(65) 3223-4567",
      description: "Clínica especializada em cardiologia.",
      specialties: ["Cardiologia", "Ecocardiograma"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      managerId: userUP.id,
      organizationId: org.id,
    },
  });

  const inst2 = await prisma.institution.create({
    data: {
      name: "Laboratório BioVida",
      cnpj: "88.777.666/0001-55",
      type: "laboratorio",
      cep: "78200-000",
      street: "Rua 7 de Setembro",
      number: "789",
      neighborhood: "Santa Isabel",
      city: "Cáceres",
      state: "MT",
      phone: "(65) 3223-6789",
      description: "Laboratório de análises clínicas.",
      specialties: ["Exames de Sangue", "Raio-X"],
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800",
      managerId: userUP.id,
      organizationId: org.id,
    },
  });

  // 5. Criar Serviços
  const srv1 = await prisma.service.create({
    data: {
      name: 'Consulta Clínica Especialidade Cardiologia',
      type: 'consulta',
      price: 250,
      duration: '45 min',
      institutionId: inst1.id
    }
  });

  const srv2 = await prisma.service.create({
    data: {
      name: 'Ecocardiograma',
      type: 'exame',
      price: 300,
      duration: '30 min',
      institutionId: inst1.id
    }
  });

  const srv3 = await prisma.service.create({
    data: {
      name: 'Exame de Sangue Completo',
      type: 'exame',
      price: 80,
      duration: '15 min',
      institutionId: inst2.id
    }
  });

  // 6. Criar TimeSlots
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(today.getDate() + 2);

  const dates = [today, tomorrow, afterTomorrow];
  const times = ['08:00', '09:00', '10:00', '14:00', '15:00'];
  const services = [srv1, srv2, srv3];

  for (const service of services) {
    for (const date of dates) {
      for (const time of times) {
        await prisma.timeSlot.create({
          data: {
            date,
            time,
            available: true,
            serviceId: service.id
          }
        });
      }
    }
  }

  // 7. Criar Agendamentos
  await prisma.appointment.create({
    data: {
      patientId: userUC.id,
      institutionId: inst1.id,
      serviceId: srv1.id,
      date: today,
      time: '08:00',
      status: AppointmentStatus.agendado
    }
  });

  // Marcar o slot como ocupado
  await prisma.timeSlot.updateMany({
    where: {
      serviceId: srv1.id,
      date: today,
      time: '08:00'
    },
    data: { available: false }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
