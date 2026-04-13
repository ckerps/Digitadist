import webpush from 'web-push';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

// ─── VAPID setup ────────────────────────────────────────────────────────────
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Tipos ──────────────────────────────────────────────────────────────────
export interface AlertaItem {
  tipo: 'stock_critico' | 'stock_bajo' | 'vencido' | 'vencimiento_cercano';
  producto: { id: number; nombre: string; codigo: string };
  mensaje: string;
}

// ─── Obtener emails de admins dinámicamente ─────────────────────────────────
async function getAdminEmails(): Promise<string[]> {
  const admins = await prisma.usuario.findMany({
    where: {
      activo: true,
      rol: { nombre: 'admin' },
    },
    select: { email: true },
  });
  return admins.map((a) => a.email);
}

// ─── Envío de email de alerta ────────────────────────────────────────────────
export async function sendAlertEmail(alertas: AlertaItem[]) {
  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return;

  const stockAlertas = alertas.filter(
    (a) => a.tipo === 'stock_critico' || a.tipo === 'stock_bajo'
  );
  const vencimientoAlertas = alertas.filter(
    (a) => a.tipo === 'vencido' || a.tipo === 'vencimiento_cercano'
  );

  const filas = (items: AlertaItem[], color: string) =>
    items
      .map(
        (a) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-family:monospace;font-size:13px;">${a.producto.codigo}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${a.producto.nombre}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:${color};font-weight:600;">${a.mensaje}</td>
        </tr>`
      )
      .join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
      <div style="background:#dc2626;padding:20px 24px;">
        <h2 style="color:#fff;margin:0;font-size:20px;">⚠️ Alertas del Sistema — Digitadist</h2>
        <p style="color:#fecaca;margin:4px 0 0;font-size:13px;">${new Date().toLocaleDateString('es-AR', { dateStyle: 'full' })}</p>
      </div>
      <div style="padding:24px;">
        ${
          stockAlertas.length > 0
            ? `<h3 style="color:#dc2626;margin:0 0 12px;font-size:15px;">📦 Alertas de Stock (${stockAlertas.length})</h3>
               <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
                 <thead><tr style="background:#fef2f2;"><th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#991b1b;">Código</th><th style="padding:8px 12px;text-align:left;">Producto</th><th style="padding:8px 12px;text-align:left;">Detalle</th></tr></thead>
                 <tbody>${filas(stockAlertas, '#b91c1c')}</tbody>
               </table>`
            : ''
        }
        ${
          vencimientoAlertas.length > 0
            ? `<h3 style="color:#d97706;margin:0 0 12px;font-size:15px;">📅 Alertas de Vencimiento (${vencimientoAlertas.length})</h3>
               <table style="width:100%;border-collapse:collapse;font-size:14px;">
                 <thead><tr style="background:#fffbeb;"><th style="padding:8px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#92400e;">Código</th><th style="padding:8px 12px;text-align:left;">Producto</th><th style="padding:8px 12px;text-align:left;">Detalle</th></tr></thead>
                 <tbody>${filas(vencimientoAlertas, '#b45309')}</tbody>
               </table>`
            : ''
        }
        <p style="color:#6b7280;font-size:12px;margin-top:24px;">Ingresá al sistema para revisar el catálogo de productos: <a href="${process.env.NEXTAUTH_URL}/productos" style="color:#dc2626;">Ver productos →</a></p>
      </div>
    </div>`;

  await resend.emails.send({
    from: 'Digitadist <alertas@digitadist.com>',
    to: adminEmails,
    subject: `⚠️ ${alertas.length} alerta(s) detectada(s) — ${new Date().toLocaleDateString('es-AR')}`,
    html,
  });
}

// ─── Envío de notificación push ──────────────────────────────────────────────
export async function sendPushToAll(payload: {
  title: string;
  body: string;
  url?: string;
}) {
  const subscriptions = await prisma.pushSubscription.findMany();
  if (subscriptions.length === 0) return;

  const pushPayload = JSON.stringify(payload);

  await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        pushPayload
      )
    )
  );
}

// ─── Función principal: detecta alertas y despacha ambos canales ─────────────
export async function dispatchAlerts() {
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
      id: true,
      nombre: true,
      codigo: true,
      stock_actual: true,
      stock_minimo: true,
      fecha_vencimiento: true,
    },
  });

  const alertas: AlertaItem[] = [];

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

  if (alertas.length === 0) return { sent: false, count: 0 };

  // Enviar en paralelo email + push
  const stock = alertas.filter(a => a.tipo === 'stock_critico' || a.tipo === 'stock_bajo').length;
  const expir = alertas.filter(a => a.tipo === 'vencido' || a.tipo === 'vencimiento_cercano').length;

  const parts: string[] = [];
  if (stock > 0) parts.push(`${stock} alerta(s) de stock`);
  if (expir > 0) parts.push(`${expir} alerta(s) de vencimiento`);

  await Promise.allSettled([
    sendAlertEmail(alertas),
    sendPushToAll({
      title: '⚠️ Alertas Digitadist',
      body: parts.join(' · '),
      url: '/productos',
    }),
  ]);

  return { sent: true, count: alertas.length };
}
