'use client';

import { Producto, EnumPresentacion } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Package } from "lucide-react";

interface MobileProductosTableProps {
  productos: Producto[];
  onRowClick: (id: number) => void;
}

const getPresentacionLabel = (presentacion: EnumPresentacion): string => {
  const labels: Record<EnumPresentacion, string> = {
    gramos: 'Gramos',
    litros: 'Litros',
  };
  return labels[presentacion] || presentacion;
};

export function MobileProductosTable({ productos, onRowClick }: MobileProductosTableProps) {
  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  };

  const getPrecioLista = (costo: any, recargo: number) => {
    const costoNum = parseFloat(costo);
    return costoNum * (1 + recargo / 100);
  };

  return (
    <div className="overflow-x-auto grid gap-3">
      {productos.map((producto) => (
        <Card
          key={producto.id}
          onClick={() => onRowClick(producto.id)}
          className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start justify-between gap-2">
              <span className="flex-1 truncate">#{producto.id} - {producto.nombre}</span>
              <Badge
                variant={producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo ? 'default' : 'destructive'}
                className={
                  producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo
                    ? 'bg-green-600 hover:bg-green-700 flex-shrink-0'
                    : 'bg-red-600 hover:bg-red-700 flex-shrink-0'
                }
              >
                {producto.stock_actual}
              </Badge>
            </CardTitle>
            <CardDescription>
              {getPresentacionLabel(producto.presentacion)} • {producto.tam_pack}{getPresentacionLabel(producto.presentacion) === 'Gramos' ? 'gr' : 'L'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-neutral-500">Costo</span>
                <p className="font-semibold text-neutral-900">${formatCurrency(producto.costo)}</p>
              </div>
              <div>
                <span className="text-neutral-500">Precio Lista</span>
                <p className="font-semibold text-neutral-900">${formatCurrency(getPrecioLista(producto.costo, producto.porcentaje_recargo))}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
              <div>
                <span className="text-neutral-500">Código</span>
                <p className="font-mono text-neutral-700">{producto.codigo}</p>
              </div>
              <div>
                <span className="text-neutral-500">Vencimiento</span>
                <p className="font-mono text-neutral-700">{formatDate(producto.fecha_vencimiento)}</p>
              </div>
            </div>
            {producto.stock_minimo && (
              <div className="text-xs text-neutral-500 pt-1">
                Stock mínimo: {producto.stock_minimo}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
