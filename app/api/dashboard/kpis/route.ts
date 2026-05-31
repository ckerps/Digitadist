import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EnumEstadoPedido } from '@prisma/client';

/**
 * @swagger
 * /api/dashboard/kpis:
 *   get:
 *     summary: Obtiene estadísticas clave (KPIs) del negocio para el dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: KPIs obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ventasMes:
 *                   type: number
 *                   description: Total facturado este mes
 *                 pedidosActivos:
 *                   type: integer
 *                   description: Cantidad de pedidos activos (registrados o en preparación)
 *                 totalProductos:
 *                   type: integer
 *                   description: Total de productos activos en catálogo
 *                 totalClientes:
 *                   type: integer
 *                   description: Total de clientes activos
 *       500:
 *         description: Error interno del servidor
 */
export async function GET() {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const [
      totalVentasMes,
      pedidosActivos,
      totalProductosActivos,
      totalClientes,
    ] = await Promise.all([
      // Ventas del mes: suma de total de pedidos no cancelados creados este mes
      prisma.pedido.aggregate({
        where: {
          fecha_creacion: { gte: inicioMes },
          estado: { not: EnumEstadoPedido.cancelado },
        },
        _sum: { total: true },
      }),
      // Pedidos activos (registrado + en_preparacion)
      prisma.pedido.count({
        where: {
          estado: {
            in: [EnumEstadoPedido.registrado, EnumEstadoPedido.en_preparacion],
          },
        },
      }),
      // Productos activos en catálogo
      prisma.producto.count({ where: { activo: true } }),
      // Clientes activos
      prisma.cliente.count({ where: { activo: true } }),
    ]);

    return NextResponse.json({
      ventasMes: totalVentasMes._sum.total ?? 0,
      pedidosActivos,
      totalProductos: totalProductosActivos,
      totalClientes,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Error al cargar KPIs' }, { status: 500 });
  }
}
