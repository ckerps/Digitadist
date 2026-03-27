'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Cliente } from '@/types/cliente';
import { MapPin, Phone, CreditCard, Building2, User } from 'lucide-react';

interface ClienteInfoCardsProps {
  cliente: Cliente;
}

export function ClienteInfoCards({ cliente }: ClienteInfoCardsProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap gap-6 justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              {cliente.tipo === 'razon_social' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />} Tipo
            </p>
            <span className="font-medium text-foreground">
              {cliente.tipo === 'razon_social' ? 'Razón Social' : 'Persona'}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <CreditCard className="w-4 h-4" /> CUIT
            </p>
            <p className="font-medium text-foreground">{cliente.cuit}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Dirección
            </p>
            <p className="font-medium text-foreground">{cliente.direccion}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Phone className="w-4 h-4" /> Teléfono
            </p>
            <p className="font-medium text-foreground">{cliente.telefono}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

