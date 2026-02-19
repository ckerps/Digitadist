'use client';

import { PedidoConProductos } from '@/types/pedido';
import { Calendar, DollarSign, User, Truck, CreditCard, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { getEstadoBadge, getPagoBadge } from './utils';

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
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Pedido #{pedido.id}
            </h1>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="default"
                className={estadoBadge.className}
              >
                {estadoBadge.label}
              </Badge>
              <Badge
                variant="default"
                className={pagoBadge.className}
              >
                {pagoBadge.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 mb-1">Total del Pedido</p>
            <p className="text-3xl font-bold text-neutral-900">
              ${formatCurrency(pedido.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 text-sm">
        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Building2 className="h-5 w-5 mr-2 text-red-600" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700 font-medium">{pedido.cliente?.nombre || 'Sin asignar'}</p>
            {pedido.cliente?.cuit && (
              <p className="text-xs text-neutral-500 mt-1">CUIT: {pedido.cliente.cuit}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Fecha de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">{formatDate(pedido.fecha_entrega_estimada)}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Truck className="h-5 w-5 mr-2 text-red-600" />
              Dirección Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">{pedido.direccion_entrega}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <CreditCard className="h-5 w-5 mr-2 text-red-600" />
              Condición de Venta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Badge
              variant="outline"
              className={pedido.condicion_venta === 'contado' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-blue-50 border-blue-300 text-blue-700'}
            >
              {pedido.condicion_venta === 'contado' ? 'Contado' : 'Transferencia'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <DollarSign className="h-5 w-5 mr-2 text-red-600" />
              Costo Total
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">${formatCurrency(pedido.costo)}</p>
          </CardContent>
        </Card>

        {pedido.descuento && (
          <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
              <CardTitle className="lg:text-lg flex items-center text-neutral-900">
                <DollarSign className="h-5 w-5 mr-2 text-red-600" />
                Descuento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-neutral-700">-${formatCurrency(pedido.descuento)}</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <User className="h-5 w-5 mr-2 text-red-600" />
              Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">
              {pedido.vendedor?.nombre && pedido.vendedor?.apellido
                ? `${pedido.vendedor.nombre} ${pedido.vendedor.apellido}`
                : 'Sin asignar'}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
