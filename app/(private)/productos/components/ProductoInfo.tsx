'use client';

import { Producto } from '@prisma/client';
import { Package, DollarSign, Calendar, TrendingUp, Tag, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductoInfoProps {
  producto: Producto;
}

export function ProductoInfo({ producto }: ProductoInfoProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No especificado';
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
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

  const precioLista = parseFloat(producto.costo as any) * (1 + producto.porcentaje_recargo / 100);
  const isStockLow = producto.stock_actual < (producto.stock_minimo || 0);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Tag className="w-4 h-4" /> Estado y Código
          </p>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="font-mono text-foreground">{producto.codigo || '-'}</span>
            <Badge
              variant="outline"
              className={producto.activo ? 'bg-green-50 border-green-300 text-green-700' : 'bg-neutral-100 border-neutral-300 text-neutral-600'}
            >
              {producto.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Percent className="w-4 h-4" /> Margen de ganancia
          </p>
          <p className="text-xl font-bold text-red-600">
            {producto.porcentaje_recargo.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Package className="w-4 h-4" /> Stock Actual
          </p>
          <div className="flex items-center gap-2">
            <p className={`font-bold ${isStockLow ? 'text-red-600' : 'text-green-600'}`}>
              {producto.stock_actual}
            </p>
            {producto.stock_minimo && (
              <span className="text-xs text-muted-foreground">(Min: {producto.stock_minimo})</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Costo
          </p>
          <p className="font-medium text-foreground">${formatCurrency(producto.costo)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Precio de Lista
          </p>
          <p className="font-bold text-foreground">${formatCurrency(precioLista)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Vencimiento
          </p>
          <p className="font-medium text-foreground">{formatDate(producto.fecha_vencimiento)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Package className="w-4 h-4" /> Presentación
          </p>
          <p className="font-medium text-foreground">
             {producto.tam_pack} {producto.presentacion === 'gramos' ? 'gr' : 'lt'}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Fecha Creación
          </p>
          <p className="font-medium text-foreground">{formatDate(producto.fecha_creacion)}</p>
        </div>
      </div>
    </div>
  );
}
