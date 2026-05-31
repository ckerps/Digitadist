import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const testDbUrl = 'postgresql://postgres:1234@localhost:5433/digitadist?sslmode=disable';

async function globalSetup() {
  console.log('Levantando base de datos local para tests...');
  execSync('docker-compose up -d db', { stdio: 'inherit' });

  // Esperar un poco para que postgres inicie
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Sincronizando esquema de Prisma...');
  execSync(`npx prisma db push`, {
    env: { ...process.env, DATABASE_URL: testDbUrl },
    stdio: 'inherit'
  });

  process.env.DATABASE_URL = testDbUrl;
  const adapter = new PrismaPg(new Pool({ connectionString: testDbUrl, ssl: false, max: 1 }));
  const prisma = new PrismaClient({ adapter });

  // Crear rol admin si no existe
  let rolAdmin = await prisma.rol.findFirst({ where: { nombre: 'admin' } });
  if (!rolAdmin) {
    rolAdmin = await prisma.rol.create({ data: { nombre: 'admin' } });
  }

  // Crear usuario test
  const hashedPassword = await bcrypt.hash('password123', 10);

  const testUser = await prisma.usuario.upsert({
    where: { email: 'test@test.com' },
    update: { password: hashedPassword, activo: true },
    create: {
      email: 'test@test.com',
      nombre: 'Test',
      apellido: 'User',
      password: hashedPassword,
      telefono: '1122334455',
      activo: true,
      rol_id: rolAdmin.id
    }
  });

  const existingCategoria = await prisma.categoria.findFirst();
  if (!existingCategoria) {
    await prisma.categoria.create({
      data: {
        nombre: 'Productos de prueba',
        descripcion: 'Categoría creada automáticamente para tests E2E',
      },
    });
  }

  console.log('Usuario de prueba listo:', testUser.email);
  await prisma.$disconnect();
}

export default globalSetup;
