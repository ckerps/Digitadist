'use client';

import { Oferta, OfertaConProducto } from '@/types/oferta';
import { Package, Tag, Percent, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

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
    <>
      <div className="mb-2">
        <div className="flex justify-start gap-3 items-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Oferta #{oferta.id}</h1>
          <Badge
            variant="default"
            className={oferta.activa ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
          >
            {oferta.activa ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-4 text-sm">
        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Package className="h-5 w-5 mr-2 text-red-600" />
              Producto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700 font-semibold">{oferta.producto.nombre}</p>
            <p className="text-neutral-500 text-xs mt-1">{oferta.producto.codigo}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Percent className="h-5 w-5 mr-2 text-red-600" />
              Tipo de Descuento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700 font-semibold">
              {oferta.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto'}
            </p>
            <span className="text-neutral-500 text-xs mt-1">
              {oferta.tipo === 'porcentaje' ? `${oferta.valor}%` : formatCurrency(oferta.valor)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Duración
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-neutral-700 text-sm">Desde {formatDate(oferta.fecha_inicio)}</p>
            <p className="text-neutral-700 text-sm">Hasta {formatDate(oferta.fecha_fin)}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
