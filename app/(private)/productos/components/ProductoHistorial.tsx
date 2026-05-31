'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface LogEntry {
  id: number;
  atributo: string;
  valor_anterior: string;
  valor_nuevo: string;
  fecha_creacion: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

export function ProductoHistorial({ productoId }: { productoId: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/productos/${productoId}/logs`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.log("Error loading logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [productoId]);

  if (loading) {
    return (
      <Card className="border-neutral-200">
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="border-neutral-200">
        <CardContent className="pt-6 text-center text-muted-foreground pb-6">
          No hay registros de cambios para este producto aún.
        </CardContent>
      </Card>
    );
  }

  const getAttributeLabel = (attr: string) => {
    const labels: Record<string, string> = {
      stock_actual: "Stock",
      stock_minimo: "Stock Mínimo",
      costo: "Costo Base",
      regargo: "Margen (%)",
      nombre: "Nombre",
      activo: "Estado"
    };
    return labels[attr] || attr;
  };

  const getLogIcon = (attr: string, oldVal: string, newVal: string) => {
    if (attr === 'stock_actual' || attr === 'costo' || attr === 'stock_minimo' || attr === 'regargo') {
      const n1 = parseFloat(oldVal);
      const n2 = parseFloat(newVal);
      if (!isNaN(n1) && !isNaN(n2)) {
        if (n2 > n1) return <TrendingUp className="w-4 h-4 text-blue-500" />;
        if (n2 < n1) return <TrendingDown className="w-4 h-4 text-red-500" />;
      }
    }
    return <Edit3 className="w-4 h-4 text-neutral-500" />;
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="pb-3 border-b border-neutral-100">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="w-4 h-4" /> Historial de Cambios
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between items-start border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="mt-1 bg-neutral-100 p-1.5 rounded-full">
                  {getLogIcon(log.atributo, log.valor_anterior, log.valor_nuevo)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {getAttributeLabel(log.atributo)}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Modificado por {log.usuario.nombre} {log.usuario.apellido}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-mono bg-neutral-50 p-1 px-2 mb-1 w-fit rounded border border-neutral-200">
                    <span className="text-neutral-500 line-through">{log.valor_anterior}</span>
                    <span className="text-neutral-400">→</span>
                    <span className="font-bold text-neutral-900">{log.valor_nuevo}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest text-right whitespace-nowrap">
                {format(new Date(log.fecha_creacion), "d MMM yyyy, HH:mm", { locale: es })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
