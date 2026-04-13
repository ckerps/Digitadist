import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    console.log('[Push] Payload recibido:', body);
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      console.warn('[Push] Datos inválidos:', { 
        endpoint: !!endpoint, 
        p256dh: !!keys?.p256dh, 
        auth: !!keys?.auth 
      });
      return NextResponse.json({ error: 'Datos de suscripción inválidos (faltan llaves o endpoint)' }, { status: 400 });
    }

    const userIdRaw = (session?.user as any)?.id;
    const userId = userIdRaw ? parseInt(userIdRaw) : null;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, usuario_id: userId },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        usuario_id: userId,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error('Error guardando suscripción push:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) return NextResponse.json({ error: 'Falta endpoint' }, { status: 400 });

    await prisma.pushSubscription.deleteMany({ where: { endpoint } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
