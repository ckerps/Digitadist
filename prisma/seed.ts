import { PrismaClient } from '@prisma/client';

const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder...');

  // Limpiar datos existentes (en orden inverso de dependencias)
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.detallePedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.oferta.deleteMany();
  await prisma.productoLog.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.configuracion.deleteMany();

  // ========== CREAR ROLES ==========
  console.log('📋 Creando roles...');
  const rolAdmin = await prisma.rol.create({
    data: { nombre: 'admin' },
  });

  const rolVendedor = await prisma.rol.create({
    data: { nombre: 'vendedor' },
  });

  // ========== CREAR USUARIOS (VENDEDORES) ==========
  console.log('👥 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan',
      apellido: 'García',
      email: 'juan.garcia@digitadist.com',
      telefono: '1123456789',
      password: hashedPassword,
      rol_id: rolVendedor.id,
      activo: true,
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'María',
      apellido: 'López',
      email: 'maria.lopez@digitadist.com',
      telefono: '1187654321',
      password: hashedPassword,
      rol_id: rolVendedor.id,
      activo: true,
    },
  });

  const usuarioAdmin = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@digitadist.com',
      telefono: '1100000000',
      password: hashedPassword,
      rol_id: rolAdmin.id,
      activo: true,
    },
  });

  // ========== CREAR CLIENTES ==========
  console.log('🏢 Creando clientes...');
  const cliente1 = await prisma.cliente.create({
    data: {
      tipo: 'razon_social',
      nombre: 'Supermercado La Buena Mano',
      direccion: 'Av. Rivadavia 1234, CABA',
      cuit: '20300000010',
      email: 'compras@labuena.com',
      telefono: '1143216543',
      activo: true,
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      tipo: 'razon_social',
      nombre: 'Distribuidora González S.A.',
      direccion: 'Calle Belgrano 567, La Plata',
      cuit: '20350000020',
      email: 'ventas@gonzalez.com',
      telefono: '2216549870',
      activo: true,
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      tipo: 'persona',
      nombre: 'Carlos Mendez',
      direccion: 'Ruta 5 km 45, Bragado',
      email: 'carlos.mendez@email.com',
      telefono: '2344567890',
      activo: true,
    },
  });

  // ========== CREAR CATEGORÍAS ==========
  console.log('📦 Creando categorías...');
  const catBebidas = await prisma.categoria.create({
    data: {
      nombre: 'Bebidas',
      descripcion: 'Bebidas diversas: jugos, refrescos, aguas',
    },
  });

  const catLacteos = await prisma.categoria.create({
    data: {
      nombre: 'Lácteos',
      descripcion: 'Productos lácteos: leche, queso, yogur',
    },
  });

  const catAlimentos = await prisma.categoria.create({
    data: {
      nombre: 'Alimentos Secos',
      descripcion: 'Alimentos no perecederos',
    },
  });

  // ========== CREAR PRODUCTOS ==========
  console.log('🛍️  Creando productos...');
  const productos = await Promise.all([
    // Bebidas
    prisma.producto.create({
      data: {
        codigo: 'BEB-001',
        nombre: 'Jugo de Naranja Natural',
        presentacion: 'litros',
        tam_pack: 1,
        costo: 2.5,
        porcentaje_recargo: 30,
        stock_actual: 150,
        stock_minimo: 20,
        activo: true,
        categoria_id: catBebidas.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'BEB-002',
        nombre: 'Agua Mineral Gasificada',
        presentacion: 'litros',
        tam_pack: 1,
        costo: 0.8,
        porcentaje_recargo: 40,
        stock_actual: 250,
        stock_minimo: 30,
        activo: true,
        categoria_id: catBebidas.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'BEB-003',
        nombre: 'Refresco Naranja 2L',
        presentacion: 'litros',
        tam_pack: 2,
        costo: 1.2,
        porcentaje_recargo: 50,
        stock_actual: 180,
        stock_minimo: 25,
        activo: true,
        categoria_id: catBebidas.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'BEB-004',
        nombre: 'Gaseosa Cola Premium',
        presentacion: 'litros',
        tam_pack: 2,
        costo: 1.5,
        porcentaje_recargo: 45,
        stock_actual: 200,
        stock_minimo: 20,
        activo: true,
        categoria_id: catBebidas.id,
      },
    }),

    // Lácteos
    prisma.producto.create({
      data: {
        codigo: 'LAC-001',
        nombre: 'Leche Entera 1L',
        presentacion: 'litros',
        tam_pack: 1,
        costo: 0.95,
        porcentaje_recargo: 25,
        stock_actual: 300,
        stock_minimo: 40,
        activo: true,
        categoria_id: catLacteos.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'LAC-002',
        nombre: 'Queso Fresco 500g',
        presentacion: 'gramos',
        tam_pack: 500,
        costo: 8.5,
        porcentaje_recargo: 20,
        stock_actual: 80,
        stock_minimo: 15,
        activo: true,
        categoria_id: catLacteos.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'LAC-003',
        nombre: 'Yogur Frutilla 125g',
        presentacion: 'gramos',
        tam_pack: 125,
        costo: 0.35,
        porcentaje_recargo: 35,
        stock_actual: 500,
        stock_minimo: 50,
        activo: true,
        categoria_id: catLacteos.id,
      },
    }),

    // Alimentos Secos
    prisma.producto.create({
      data: {
        codigo: 'ALI-001',
        nombre: 'Harina de Trigo 1kg',
        presentacion: 'gramos',
        tam_pack: 1000,
        costo: 0.72,
        porcentaje_recargo: 40,
        stock_actual: 400,
        stock_minimo: 50,
        activo: true,
        categoria_id: catAlimentos.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'ALI-002',
        nombre: 'Café Molido Premium 250g',
        presentacion: 'gramos',
        tam_pack: 250,
        costo: 2.8,
        porcentaje_recargo: 55,
        stock_actual: 120,
        stock_minimo: 20,
        activo: true,
        categoria_id: catAlimentos.id,
      },
    }),

    prisma.producto.create({
      data: {
        codigo: 'ALI-003',
        nombre: 'Arroz Blanco 2kg',
        presentacion: 'gramos',
        tam_pack: 2000,
        costo: 1.2,
        porcentaje_recargo: 35,
        stock_actual: 250,
        stock_minimo: 30,
        activo: true,
        categoria_id: catAlimentos.id,
      },
    }),
  ]);

  console.log(`✅ Creados ${productos.length} productos`);

  // ========== CREAR PEDIDOS CON DETALLES ==========
  console.log('📝 Creando pedidos...');

  // Pedido 1: Cliente 1 con usuario 1
  const fechaEntrega1 = new Date();
  fechaEntrega1.setDate(fechaEntrega1.getDate() + 7);

  const pedido1 = await prisma.pedido.create({
    data: {
      cliente_id: cliente1.id,
      vendedor_id: usuario1.id,
      total: 450.5,
      costo: 300.0,
      descuento: 10.0,
      estado: 'en_preparacion',
      estado_pago: 'en_deuda',
      direccion_entrega: 'Av. Rivadavia 1234, CABA',
      fecha_entrega_estimada: fechaEntrega1,
      condicion_venta: 'transferencia',
      detallePedidos: {
        create: [
          {
            producto_id: productos[0].id, // Jugo Naranja
            cantidad: 50,
            precio_unitario: 3.25,
            subtotal: 162.5,
          },
          {
            producto_id: productos[1].id, // Agua Mineral
            cantidad: 100,
            precio_unitario: 1.12,
            subtotal: 112.0,
          },
          {
            producto_id: productos[4].id, // Leche 1L
            cantidad: 30,
            precio_unitario: 1.1875,
            subtotal: 356.25,
            descuento: 156.25,
          },
        ],
      },
    },
  });

  // Pedido 2: Cliente 2 con usuario 2
  const fechaEntrega2 = new Date();
  fechaEntrega2.setDate(fechaEntrega2.getDate() + 5);

  const pedido2 = await prisma.pedido.create({
    data: {
      cliente_id: cliente2.id,
      vendedor_id: usuario2.id,
      total: 680.0,
      costo: 500.0,
      estado: 'registrado',
      estado_pago: 'pagado',
      direccion_entrega: 'Calle Belgrano 567, La Plata',
      fecha_entrega_estimada: fechaEntrega2,
      condicion_venta: 'contado',
      detallePedidos: {
        create: [
          {
            producto_id: productos[2].id, // Refresco Naranja 2L
            cantidad: 80,
            precio_unitario: 1.8,
            subtotal: 144.0,
          },
          {
            producto_id: productos[5].id, // Queso Fresco
            cantidad: 20,
            precio_unitario: 10.2,
            subtotal: 204.0,
          },
          {
            producto_id: productos[7].id, // Café Molido
            cantidad: 40,
            precio_unitario: 4.34,
            subtotal: 173.6,
          },
          {
            producto_id: productos[8].id, // Arroz Blanco
            cantidad: 15,
            precio_unitario: 1.62,
            subtotal: 24.3,
          },
        ],
      },
    },
  });

  // Pedido 3: Cliente 3 con usuario 1
  const fechaEntrega3 = new Date();
  fechaEntrega3.setDate(fechaEntrega3.getDate() + 3);

  const pedido3 = await prisma.pedido.create({
    data: {
      cliente_id: cliente3.id,
      vendedor_id: usuario1.id,
      total: 256.8,
      costo: 180.0,
      estado: 'entregado',
      estado_pago: 'pagado',
      direccion_entrega: 'Ruta 5 km 45, Bragado',
      fecha_entrega_estimada: fechaEntrega3,
      condicion_venta: 'contado',
      detallePedidos: {
        create: [
          {
            producto_id: productos[3].id, // Gaseosa Cola Premium
            cantidad: 60,
            precio_unitario: 2.175,
            subtotal: 130.5,
          },
          {
            producto_id: productos[6].id, // Yogur Frutilla
            cantidad: 100,
            precio_unitario: 0.4725,
            subtotal: 47.25,
          },
          {
            producto_id: productos[9].id, // Harina Trigo
            cantidad: 25,
            precio_unitario: 1.008,
            subtotal: 25.2,
          },
        ],
      },
    },
  });

  // Pedido 4: Cliente 1 con usuario 2 (cliente 1 tiene 2 pedidos)
  const fechaEntrega4 = new Date();
  fechaEntrega4.setDate(fechaEntrega4.getDate() + 10);

  const pedido4 = await prisma.pedido.create({
    data: {
      cliente_id: cliente1.id,
      vendedor_id: usuario2.id,
      total: 520.0,
      costo: 380.0,
      descuento: 20.0,
      estado: 'finalizado',
      estado_pago: 'en_deuda',
      direccion_entrega: 'Av. Rivadavia 1234, CABA',
      fecha_entrega_estimada: fechaEntrega4,
      condicion_venta: 'transferencia',
      detallePedidos: {
        create: [
          {
            producto_id: productos[0].id, // Jugo Naranja
            cantidad: 40,
            precio_unitario: 3.25,
            subtotal: 130.0,
          },
          {
            producto_id: productos[2].id, // Refresco Naranja 2L
            cantidad: 50,
            precio_unitario: 1.8,
            subtotal: 90.0,
          },
          {
            producto_id: productos[4].id, // Leche 1L
            cantidad: 80,
            precio_unitario: 1.1875,
            subtotal: 95.0,
          },
          {
            producto_id: productos[5].id, // Queso Fresco
            cantidad: 15,
            precio_unitario: 10.2,
            subtotal: 153.0,
            descuento: 28.0,
          },
        ],
      },
    },
  });

  console.log('✅ Creados 4 pedidos con detalles');

  // ========== CREAR CONFIGURACIONES ==========
  console.log('⚙️  Creando configuraciones...');
  await prisma.configuracion.create({
    data: {
      nombre: 'empresa_nombre',
      valor: 'Digitadist SA',
      tipo_valor: 'string',
    },
  });

  await prisma.configuracion.create({
    data: {
      nombre: 'empresa_cuit',
      valor: '20200000000',
      tipo_valor: 'string',
    },
  });

  await prisma.configuracion.create({
    data: {
      nombre: 'items_por_pagina',
      valor: '10',
      tipo_valor: 'int',
    },
  });

  console.log('✅ Configuraciones creadas');

  // ========== RESUMEN ==========
  console.log('\n✨ SEEDER COMPLETADO EXITOSAMENTE ✨\n');
  console.log('📊 Resumen de datos creados:');
  console.log(`   • Roles: 2 (admin, vendedor)`);
  console.log(`   • Usuarios: 3 (2 vendedores + 1 admin)`);
  console.log(`   • Clientes: 3`);
  console.log(`   • Categorías: 3`);
  console.log(`   • Productos: ${productos.length}`);
  console.log(`   • Pedidos: 4`);
  console.log(`   • Detalles de Pedidos: 11`);
  console.log('\n🔐 Credenciales de prueba:');
  console.log('   Email: juan.garcia@digitadist.com');
  console.log('   Email: maria.lopez@digitadist.com');
  console.log('   Email: admin@digitadist.com');
  console.log('   Password: password123');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
