import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/push/vapid-key:
 *   get:
 *     summary: Obtiene la clave pública VAPID para inicializar suscripciones push en el frontend
 *     tags: [Notificaciones Push]
 *     responses:
 *       200:
 *         description: Clave pública devuelta exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 publicKey:
 *                   type: string
 */
export async function GET() {
  return NextResponse.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
}
