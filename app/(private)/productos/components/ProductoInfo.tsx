'use client';

import { Producto } from '@prisma/client';
import { Package, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

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
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              {producto.nombre}
            </h1>
            <p className="text-sm text-neutral-600 mb-2">Código: {producto.codigo}</p>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={producto.activo ? 'bg-green-50 border-green-300 text-green-700' : 'bg-neutral-100 border-neutral-300 text-neutral-600'}
              >
                {producto.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 mb-1">Margen de ganancia</p>
            <p className="text-3xl font-bold text-red-600">
              {producto.porcentaje_recargo.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 text-sm">
        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <Package className="h-5 w-5 mr-2 text-red-600" />
              Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className={`text-lg font-bold ${isStockLow ? 'text-red-600' : 'text-green-600'}`}>
                {producto.stock_actual}
              </p>
              <Badge
                className={isStockLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
              >
                {isStockLow ? 'Bajo' : 'OK'}
              </Badge>
            </div>
            {producto.stock_minimo && (
              <p className="text-xs text-neutral-500 mt-2">Min: {producto.stock_minimo}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <DollarSign className="h-5 w-5 mr-2 text-red-600" />
              Costo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-lg font-bold text-neutral-700">
              ${formatCurrency(producto.costo)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
              Precio de lista
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-lg font-bold text-neutral-700">
              ${formatCurrency(precioLista)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Vencimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700 font-medium">
              {formatDate(producto.fecha_vencimiento)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 text-sm">
        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <Package className="h-5 w-5 mr-2 text-red-600" />
              Presentación
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-neutral-700 font-medium">
                {producto.presentacion === 'gramos' ? 'Gramos' : 'Litros'}
              </p>
              <p className="text-lg font-bold text-neutral-900">
                {producto.tam_pack} {producto.presentacion === 'gramos' ? 'gr' : 'lt'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-base flex items-center text-neutral-900">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Creación
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">
              {formatDate(producto.fecha_creacion)}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
