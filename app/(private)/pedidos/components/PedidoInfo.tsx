'use client';

import { PedidoConProductos } from '@/types/pedido';
import { Calendar, DollarSign, User, Truck, CreditCard, Building2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getEstadoBadge, getPagoBadge } from './utils';
import { Card, CardContent } from '@/components/ui/card';

interface PedidoInfoProps {
  pedido: PedidoConProductos;
}

export function PedidoInfo({ pedido }: PedidoInfoProps) {
  const estadoBadge = getEstadoBadge(pedido.estado);
  const pagoBadge = getPagoBadge(pedido.estado_pago);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Tag className="w-4 h-4" /> Estados
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default" className={estadoBadge.className}>
                {estadoBadge.label}
              </Badge>
              <Badge variant="default" className={pagoBadge.className}>
                {pagoBadge.label}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Total
            </p>
            <p className="text-xl font-bold text-foreground">
              ${formatCurrency(pedido.total)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Building2 className="w-4 h-4" /> Cliente
            </p>
            <p className="font-medium text-foreground">{pedido.cliente?.nombre || 'Sin asignar'}</p>
            {pedido.cliente?.cuit && (
              <p className="text-xs text-muted-foreground">CUIT: {pedido.cliente.cuit}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Fecha Entrega
            </p>
            <p className="font-medium text-foreground">{formatDate(pedido.fecha_entrega_estimada)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Truck className="w-4 h-4" /> Dirección Entrega
            </p>
            <p className="font-medium text-foreground">{pedido.direccion_entrega}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> Condición Venta
            </p>
            <span className="font-medium capitalize text-foreground">{pedido.condicion_venta}</span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <User className="w-4 h-4" /> Vendedor
            </p>
            <p className="font-medium text-foreground">
              {pedido.vendedor?.nombre && pedido.vendedor?.apellido
                ? `${pedido.vendedor.nombre} ${pedido.vendedor.apellido}`
                : 'Sin asignar'}
            </p>
          </div>

          {pedido.descuento && (
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> Descuento
              </p>
              <p className="font-medium text-foreground">-${formatCurrency(pedido.descuento)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
