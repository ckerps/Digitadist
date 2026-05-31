import { NextResponse } from 'next/server';
import { dispatchAlerts } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

// Clave para debounce: sólo enviamos alertas una vez cada 24 horas
const DEBOUNCE_KEY = 'ultima_alerta_enviada';

/**
 * @swagger
 * /api/dashboard/alertas:
 *   get:
 *     summary: Obtiene alertas del sistema (stock crítico, stock bajo, vencidos, vencimientos cercanos) y notifica vía push si corresponde
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Alertas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alertas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         enum: [stock_critico, stock_bajo, vencido, vencimiento_cercano]
 *                       producto:
 *                         type: object
 *                       mensaje:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 */
export async function GET() {
  try {
    const config = await prisma.configuracion.findUnique({
      where: { nombre: 'dias_anticipacion_vencimiento' },
    });
    const diasVencimiento = config ? parseInt(config.valor) || 30 : 30;

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + diasVencimiento);

    const productos = await prisma.producto.findMany({
      where: { activo: true },
      select: {
        id: true, nombre: true, codigo: true,
        stock_actual: true, stock_minimo: true, fecha_vencimiento: true,
      },
    });

    const alertas: any[] = [];
    for (const p of productos) {
      if (p.stock_actual <= 0) {
        alertas.push({ tipo: 'stock_critico', producto: p, mensaje: `Sin stock (${p.stock_actual} ud)` });
      } else if (p.stock_minimo !== null && p.stock_actual <= p.stock_minimo) {
        alertas.push({ tipo: 'stock_bajo', producto: p, mensaje: `Stock bajo (actual: ${p.stock_actual}, mín: ${p.stock_minimo})` });
      }
      if (p.fecha_vencimiento) {
        const fVenc = new Date(p.fecha_vencimiento);
        if (fVenc < hoy) {
          alertas.push({ tipo: 'vencido', producto: p, mensaje: `Vencido el ${fVenc.toLocaleDateString('es-AR')}` });
        } else if (fVenc <= fechaLimite) {
          alertas.push({ tipo: 'vencimiento_cercano', producto: p, mensaje: `Vence el ${fVenc.toLocaleDateString('es-AR')}` });
        }
      }
    }

    // Debounce: no re-enviar si ya se envió hace menos de 24 horas
    let shouldSendNotifications = false;
    if (alertas.length > 0) {
      const ultimaAlerta = await prisma.configuracion.findUnique({
        where: { nombre: DEBOUNCE_KEY },
      });
      if (ultimaAlerta) {
        const horasDesdeUltima =
          (Date.now() - new Date(ultimaAlerta.valor).getTime()) / 1000 / 3600;
        shouldSendNotifications = horasDesdeUltima >= 24;
      } else {
        shouldSendNotifications = true;
      }

      if (shouldSendNotifications) {
        // Actualizar timestamp de última alerta
        await prisma.configuracion.upsert({
          where: { nombre: DEBOUNCE_KEY },
          update: { valor: new Date().toISOString() },
          create: { nombre: DEBOUNCE_KEY, valor: new Date().toISOString(), tipo_valor: 'string' },
        });

        // Disparar alertas en background (no bloquear la respuesta)
        dispatchAlerts().catch(console.log);
      }
    }

    return NextResponse.json({ alertas }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Error al cargar alertas' }, { status: 500 });
  }
}
