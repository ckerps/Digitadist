'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, PackageX, CalendarX, ArrowRight, Bell, BellOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// ─── Push helpers ─────────────────────────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i);
  return output;
}

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  try {
    const reg = await navigator.serviceWorker.ready;
    const vapidRes = await fetch('/api/push/vapid-key');
    const { publicKey } = await vapidRes.json();
    if (!publicKey) return null;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub.toJSON()),
    });

    return sub;
  } catch (e) {
    console.error('[Push] Error al suscribirse:', e);
    return null;
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function DashboardAlerts() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const router = useRouter();
  const didRequestPush = useRef(false);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const res = await fetch('/api/dashboard/alertas');
        if (res.ok) {
          const data = await res.json();
          setAlertas(data.alertas ?? []);
        }
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    };
    fetchAlertas();
  }, []);

  // Solicitar permiso push una sola vez (solo si hay alertas)
  useEffect(() => {
    if (!alertas.length || didRequestPush.current) return;
    if (!('Notification' in window)) return;

    didRequestPush.current = true;

    const trySubscribe = async () => {
      if (Notification.permission === 'granted') {
        const sub = await subscribeToPush();
        if (sub) setPushEnabled(true);
      } else if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          const sub = await subscribeToPush();
          if (sub) {
            setPushEnabled(true);
            toast.success('Notificaciones activadas', {
              description: 'Recibirás alertas de stock y vencimiento.',
            });
          }
        }
      }
    };
    trySubscribe();
  }, [alertas]);

  if (loading) {
    return <Skeleton className="w-full h-16 rounded-md mb-4" />;
  }

  if (alertas.length === 0) return null;

  const stockAlertas = alertas.filter(
    (a) => a.tipo === 'stock_critico' || a.tipo === 'stock_bajo'
  );
  const expirAlertas = alertas.filter(
    (a) => a.tipo === 'vencido' || a.tipo === 'vencimiento_cercano'
  );

  return (
    <div className="space-y-3 mb-6">
      {stockAlertas.length > 0 && (
        <Alert className="border-red-200 bg-red-50 text-red-900 relative pr-24">
          <PackageX className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 font-bold">
            Alertas de Stock
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs w-5 h-5 font-mono">
              {stockAlertas.length}
            </span>
          </AlertTitle>
          <AlertDescription className="text-red-700">
            {stockAlertas.length === 1
              ? `"${stockAlertas[0].producto.nombre}" — ${stockAlertas[0].mensaje}`
              : `${stockAlertas.length} productos superaron el límite de alerta o se agotaron.`}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 hover:bg-red-100 text-red-700 text-xs gap-1"
            onClick={() => router.push('/productos')}
          >
            Ver <ArrowRight className="w-3 h-3" />
          </Button>
        </Alert>
      )}

      {expirAlertas.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 relative pr-24">
          <CalendarX className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 font-bold">
            Alertas de Vencimiento
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-yellow-500 text-white text-xs w-5 h-5 font-mono">
              {expirAlertas.length}
            </span>
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            {expirAlertas.length === 1
              ? `"${expirAlertas[0].producto.nombre}" — ${expirAlertas[0].mensaje}`
              : `${expirAlertas.length} productos próximos a vencer o ya vencidos.`}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 hover:bg-yellow-100 text-yellow-700 text-xs gap-1"
            onClick={() => router.push('/productos')}
          >
            Ver <ArrowRight className="w-3 h-3" />
          </Button>
        </Alert>
      )}

      {/* Indicador de estado de Push */}
      {pushEnabled && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Bell className="w-3 h-3 text-green-500" /> Notificaciones push activadas
        </p>
      )}
    </div>
  );
}
