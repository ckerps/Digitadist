'use client';

import { Producto, EnumPresentacion } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-3">
      {(productos || []).map((producto) => (
        <Card
          key={producto.id}
          onClick={() => onRowClick(producto.id)}
          className="hover:bg-accent cursor-pointer transition-colors duration-200 border-border/60 shadow-xs"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-start justify-between gap-2 text-base font-semibold">
              <span className="flex-1 truncate">#{producto.id} - {producto.nombre}</span>
              <Badge
                variant={producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo ? 'default' : 'destructive'}
                className={
                  producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo
                    ? 'bg-green-600 hover:bg-green-700 flex-shrink-0 text-white'
                    : 'bg-destructive hover:bg-destructive/90 flex-shrink-0 text-white'
                }
              >
                Stock: {producto.stock_actual}
              </Badge>
            </CardTitle>
            <CardDescription className="pt-1">
              <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                {getPresentacionLabel(producto.presentacion)} • {producto.tam_pack}{getPresentacionLabel(producto.presentacion) === 'Gramos' ? 'gr' : 'L'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">Costo</span>
                <p className="text-muted-foreground tracking-tight">${formatCurrency(producto.costo)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Precio Lista</span>
                <p className="font-semibold text-foreground tracking-tight">${formatCurrency(getPrecioLista(producto.costo, producto.porcentaje_recargo))}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <span className="text-muted-foreground flex flex-col">Código <span className="font-mono text-foreground">{producto.codigo || '-'}</span></span>
              </div>
              <div>
                <span className="text-muted-foreground flex flex-col">Vencimiento <span className="font-mono text-foreground">{formatDate(producto.fecha_vencimiento)}</span></span>
              </div>
            </div>
            {producto.stock_minimo && (
              <div className="text-xs text-muted-foreground pt-1">
                Mínimo: {producto.stock_minimo}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
