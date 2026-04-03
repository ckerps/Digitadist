'use client';

import { Producto } from '@prisma/client';
import { Package, DollarSign, Calendar, TrendingUp, Tag, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductoInfoProps {
  producto: Producto;
}

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const costo = parseFloat(producto.costo as any);
  const recargo = producto.porcentaje_recargo;
  const precioLista = costo * (1 + recargo / 100);
  
  const stockActual = producto.stock_actual;
  const stockMinimo = producto.stock_minimo || 0;
  const isStockLow = stockActual <= stockMinimo;
  
  // Calcular porcentaje de stock (cap at 100%)
  const stockPercentage = stockMinimo > 0 ? Math.min((stockActual / (stockMinimo * 2)) * 100, 100) : 100;

  return (
    <Card className="border-neutral-200">
      <CardContent className="pt-6 space-y-6">
        {/* Sección de Precios */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Costo Base</p>
            <p className="text-xl font-semibold text-neutral-500">{formatCurrency(costo)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-red-600 uppercase font-bold tracking-wider">Precio de Venta</p>
            <p className="text-2xl font-black text-red-600">{formatCurrency(precioLista)}</p>
          </div>
        </div>

        <Separator />

        {/* Sección de Stock */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                <Package className="w-3 h-3" /> Estado de Existencias
              </p>
              <p className={`text-2xl font-bold ${isStockLow ? 'text-red-600' : 'text-green-600'}`}>
                {stockActual} Unidades
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={isStockLow ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}
            >
              {isStockLow ? 'Stock Bajo' : 'Stock Saludable'}
            </Badge>
          </div>
          <Progress 
            value={stockPercentage} 
            className={`h-2 ${isStockLow ? 'bg-red-100' : 'bg-green-100'}`}
            // We can't pass indicatorClassName easily with standard shadcn Progress, so we'll stick to a simple one or style it via CSS if needed.
          />
          {stockMinimo > 0 && (
            <p className="text-xs text-muted-foreground">
              Mínimo requerido: <span className="font-bold">{stockMinimo}</span> unidades.
            </p>
          )}
        </div>

        <Separator />

        {/* Detalles Técnicos */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <Tag className="w-3 h-3" /> Código
            </p>
            <p className="font-mono font-medium">{producto.codigo}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <Percent className="w-3 h-3" /> Margen
            </p>
            <p className="font-medium">{recargo}% sobre costo</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <Package className="w-3 h-3" /> Formato
            </p>
            <p className="font-medium">{producto.tam_pack} {producto.presentacion}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" /> Vencimiento
            </p>
            <p className="font-medium">{formatDate(producto.fecha_vencimiento)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

