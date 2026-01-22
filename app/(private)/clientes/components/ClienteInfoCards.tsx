'use client';

import { Cliente } from '@/types/cliente';
import { MapPin, Phone, CreditCard, Building2, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface ClienteInfoCardsProps {
  cliente: Cliente;
}

export function ClienteInfoCards({ cliente }: ClienteInfoCardsProps) {
  return (
    <>
      <div className="mb-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{cliente.nombre}</h1>
            <Badge
              variant="default"
              className={cliente.tipo === 'razon_social' ? 'bg-red-600 hover:bg-red-700' : 'bg-neutral-600'}
            >
              {cliente.tipo === 'razon_social' ? (
                <><Building2 className="h-3 w-3 mr-1" /> Razón Social</>
              ) : (
                <><User className="h-3 w-3 mr-1" /> Persona</>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-4 text-sm">
        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Dirección
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700">{cliente.direccion}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <CreditCard className="h-5 w-5 mr-2 text-red-600" />
              CUIT
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-neutral-700 font-mono">{cliente.cuit}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-linear-to-r from-red-50 to-white p-4">
            <CardTitle className="lg:text-lg flex items-center text-neutral-900">
              <Phone className="h-5 w-5 mr-2 text-red-600" />
              Teléfono
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-neutral-700">{cliente.telefono}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

