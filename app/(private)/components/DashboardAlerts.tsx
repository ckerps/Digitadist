'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, PackageX, CalendarX, ArrowRight, Bell, BellOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function DashboardAlerts() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const pushEnabled = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';

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

      {/* Indicador de estado de Push simplificado */}
      {pushEnabled && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Bell className="w-3 h-3 text-green-500" /> Notificaciones push activadas
        </p>
      )}
    </div>
  );
}

