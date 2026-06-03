require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const bcrypt = require('bcrypt');

async function main() {
  const a = await bcrypt.hash('admin123', 10);
  const s = await bcrypt.hash('seller123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', password: a, role: 'ADMIN' }
  });
  await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { email: 'seller@example.com', password: s, role: 'SELLER' }
  });
  console.log('Seeded users');
}

main().catch(console.error).finally(() => prisma.$disconnect());
