'use client';

import { Oferta } from '@prisma/client';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';

interface MobileOfertasTableProps {
  ofertas: Oferta[];
}

export function MobileOfertasTable({ ofertas }: MobileOfertasTableProps) {
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  };

  const formatCurrency = (value: any) => {
    return parseFloat(value || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje':
        return '%';
      case 'valor_fijo':
        return '$';
      default:
        return tipo;
    }
  };

  if (!ofertas || ofertas.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No hay ofertas relacionadas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ofertas.map((oferta) => (
        <Card key={oferta.id} className="border-neutral-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Oferta #{oferta.id}</p>
                <p className="text-lg font-bold text-neutral-900">
                  {oferta.tipo === 'porcentaje' 
                    ? `${parseFloat(oferta.valor as any).toFixed(0)}%` 
                    : `$${formatCurrency(oferta.valor)}`}
                </p>
              </div>
              <Badge
                className={oferta.activa ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}
              >
                {oferta.activa ? 'activa' : 'inactiva'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-neutral-500 mb-1">Creación</p>
                <p className="text-neutral-700 font-medium">{formatDate(oferta.fecha_creacion)}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Inicio</p>
                <p className="text-neutral-700 font-medium">{formatDate(oferta.fecha_inicio)}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Fin</p>
                <p className="text-neutral-700 font-medium">{formatDate(oferta.fecha_fin)}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Unidad</p>
                <p className="text-neutral-700 font-medium">{getTipoLabel(oferta.tipo)}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
