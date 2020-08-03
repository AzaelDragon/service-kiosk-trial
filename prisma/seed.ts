import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();

  console.log('🌱 Seeding database with users...');

  const admin = await prisma.user.create({
    data: {
      document: 1122334455,
      firstName: 'Adam',
      lastName: 'Campbell',
      email: 'adam@kiosk.com',
      password: '$2b$10$O.2Ivo1MoHW/GlibCDjzA.fucX9K3xUZujL1hsFBq7CiHVrW.kIb.', // secret123
      role: 'ADMIN',
    },
  });

  const technician1 = await prisma.user.create({
    data: {
      document: 449499302,
      firstName: 'Alexander',
      lastName: 'McClain',
      email: 'alex@kiosk.com',
      password: '$2b$10$h4KPLfdkAKhuFejeBq0Tg.vG53V1H7ZHHUoOrXJhA/uP1J3t4q9hi', // tech123
      role: 'TECHNICIAN',
    },
  });

  const technician2 = await prisma.user.create({
    data: {
      document: 5554436781,
      firstName: 'Reinhardt',
      lastName: 'Wilhelm',
      email: 'reinhardt@kiosk.com',
      password: '$2b$10$h4KPLfdkAKhuFejeBq0Tg.vG53V1H7ZHHUoOrXJhA/uP1J3t4q9hi', // tech123
      role: 'TECHNICIAN',
    },
  });

  const client1 = await prisma.user.create({
    data: {
      document: 123392032,
      firstName: 'Elizabeth',
      lastName: 'Turner',
      email: 'elizabeth@email.com',
      password: '$2b$10$hPqznKMFQitcFjFx0hv8V.kHcvsDu8N6LjkeMc3eqmb9Vw.dfzCoK', // client123
      role: 'CLIENT',
    },
  });

  const client2 = await prisma.user.create({
    data: {
      document: 336566423,
      firstName: 'Robert',
      lastName: 'Barley',
      email: 'robert@email.com',
      password: '$2b$10$hPqznKMFQitcFjFx0hv8V.kHcvsDu8N6LjkeMc3eqmb9Vw.dfzCoK', // client123
      role: 'CLIENT',
    },
  });

  console.log({ admin, technician1, technician2, client1, client2 });

  console.log('🌱 Seeding database with tickets...');

  const ticket1 = await prisma.ticket.create({
    data: {
      date: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      client: {
        connect: {
          id: 4,
        },
      },
      technician: {
        connect: {
          id: 2,
        },
      },
      status: 'ASSIGNED',
      type: 'INSTALLATION',
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      date: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      client: {
        connect: {
          id: 5,
        },
      },
      technician: {
        connect: {
          id: 3,
        },
      },
      status: 'IN_PROGRESS',
      type: 'MAINTENANCE',
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      date: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      client: {
        connect: {
          id: 5,
        },
      },
      technician: {
        connect: {
          id: 2,
        },
      },
      status: 'FINISHED',
      type: 'WARRANTY',
    },
  });

  console.log({ ticket1, ticket2, ticket3 });
  console.log('🌱 All seeds were correctly applied. Disconnecting...');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
