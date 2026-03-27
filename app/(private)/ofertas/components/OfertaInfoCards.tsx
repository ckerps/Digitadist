'use client';

import { Oferta, OfertaConProducto } from '@/types/oferta';
import { Package, Tag, Percent, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OfertaInfoCardsProps {
  oferta: OfertaConProducto;
}

export function OfertaInfoCards({ oferta }: OfertaInfoCardsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Tag className="w-4 h-4" /> Estado
          </p>
          <Badge
            variant="outline"
            className={oferta.activa ? 'bg-green-50 border-green-300 text-green-700' : 'bg-neutral-100 border-neutral-300 text-neutral-600'}
          >
            {oferta.activa ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Package className="w-4 h-4" /> Producto
          </p>
          <p className="font-medium text-foreground">{oferta.producto.nombre}</p>
          <p className="text-xs text-muted-foreground font-mono">{oferta.producto.codigo}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Percent className="w-4 h-4" /> Descuento
          </p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-foreground">
               {oferta.tipo === 'porcentaje' ? `${oferta.valor}%` : formatCurrency(oferta.valor)}
            </p>
            <span className="text-xs text-muted-foreground capitalize">({oferta.tipo})</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Duración
          </p>
          <p className="font-medium text-foreground">
             {formatDate(oferta.fecha_inicio)} - {formatDate(oferta.fecha_fin)}
          </p>
        </div>
      </div>
    </div>
  );
}
