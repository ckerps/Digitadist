import { NextRequest, NextResponse } from 'next/server';
import { dispatchAlerts } from '@/lib/notifications';

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
    console.error('[Cron Notifications Error]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al procesar las alertas del sistema' 
    }, { status: 500 });
  }
}
