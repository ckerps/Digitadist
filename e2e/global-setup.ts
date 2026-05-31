import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const testDbUrl = 'postgresql://postgres:1234@localhost:5433/digitadist';

async function globalSetup() {
  console.log('Levantando base de datos local para tests...');
  execSync('docker-compose up -d db', { stdio: 'inherit' });
  
  // Esperar un poco para que postgres inicie
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Sincronizando esquema de Prisma...');
  execSync(`npx prisma db push --skip-generate`, { 
    env: { ...process.env, DATABASE_URL: testDbUrl },
    stdio: 'inherit' 
  });

  const prisma = new PrismaClient({
    datasources: { db: { url: testDbUrl } },
  });

  console.log('Seedeando base de datos...');
  
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

  console.log('Usuario de prueba listo:', testUser.email);
  await prisma.$disconnect();
}

export default globalSetup;
