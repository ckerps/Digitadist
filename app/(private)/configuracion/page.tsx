'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save, Bell, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface ConfigItem {
  nombre: string;
  valor: string;
  tipo_valor: string;
}

const CONFIG_DEFAULTS: Record<string, ConfigItem> = {
  dias_anticipacion_vencimiento: {
    nombre: 'dias_anticipacion_vencimiento',
    valor: '30',
    tipo_valor: 'int',
  },
  dias_anticipacion_oferta: {
    nombre: 'dias_anticipacion_oferta',
    valor: '7',
    tipo_valor: 'int',
  },
};

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configs, setConfigs] = useState<Record<string, string>>({
    dias_anticipacion_vencimiento: '30',
    dias_anticipacion_oferta: '7',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/configuracion');
        if (res.ok) {
          const data: ConfigItem[] = await res.json();
          const map: Record<string, string> = { ...configs };
          data.forEach((c) => {
            if (c.nombre in map) map[c.nombre] = c.valor;
          });
          setConfigs(map);
        }
      } catch {
        toast.error('Error al cargar configuración');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(configs).map(([nombre, valor]) => ({
        ...CONFIG_DEFAULTS[nombre],
        valor,
      }));

      const res = await fetch('/api/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: payload }),
      });

      if (res.ok) {
        toast.success('Configuración guardada exitosamente');
      } else {
        toast.error('Fallo al guardar');
      }
    } catch {
      toast.error('Error de red');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: string) =>
    setConfigs((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div>
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header — mismo patrón que /clientes */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ajustá los parámetros generales del sistema.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Card de alertas — mismo contenedor que /clientes */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex items-center gap-2">
          <Bell className="h-4 w-4 text-red-600" />
          <h2 className="font-semibold text-base text-foreground">Alertas y Notificaciones</h2>
        </div>

        <div className="p-5 space-y-6">
          {/* Item 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="dias-venc" className="text-sm font-medium text-foreground">
                Anticipación de vencimiento de productos
              </label>
              <p className="text-xs text-muted-foreground">
                Días antes del vencimiento a partir de los cuales se genera una alerta en el
                Dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="dias-venc"
                type="number"
                min={1}
                max={365}
                value={configs.dias_anticipacion_vencimiento}
                onChange={(e) => set('dias_anticipacion_vencimiento', e.target.value)}
                className="max-w-[100px]"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">días</span>
            </div>
          </div>

          <Separator />

          {/* Item 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="dias-oferta" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
                Anticipación de vencimiento de ofertas
              </label>
              <p className="text-xs text-muted-foreground">
                Días antes del fin de una oferta para recibir notificación de renovación.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="dias-oferta"
                type="number"
                min={1}
                max={90}
                value={configs.dias_anticipacion_oferta}
                onChange={(e) => set('dias_anticipacion_oferta', e.target.value)}
                className="max-w-[100px]"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
