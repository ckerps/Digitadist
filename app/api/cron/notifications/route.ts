import { NextRequest, NextResponse } from 'next/server';
import { dispatchAlerts } from '@/lib/notifications';

/**
 * @swagger
 * /api/cron/notifications:
 *   get:
 *     summary: Procesa y envía alertas programadas (ej. vencimiento y stock bajo) vía notificaciones push
 *     tags: [Cron Jobs]
 *     parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *         required: false
 *         description: Encabezado Bearer token para validación de cron en producción (Bearer <CRON_SECRET>)
 *     responses:
 *       200:
 *         description: Alertas procesadas y enviadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: No autorizado (token incorrecto en producción)
 *       500:
 *         description: Error al procesar alertas programadas
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  // En producción, Vercel envía Bearer <CRON_SECRET>
  if (process.env.NODE_ENV === 'production') {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    const result = await dispatchAlerts();

    return NextResponse.json({
      success: true,
      message: result.sent
        ? `${result.count} alertas enviadas exitosamente.`
        : 'No se detectaron alertas para enviar.',
      data: result
    });
  } catch (error) {
    console.log('[Cron Notifications Error]:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al procesar las alertas del sistema'
    }, { status: 500 });
  }
}
