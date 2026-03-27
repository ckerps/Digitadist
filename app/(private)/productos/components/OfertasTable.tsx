'use client';

import { Oferta } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OfertasTableProps {
  ofertas: Oferta[];
}

export function OfertasTable({ ofertas }: OfertasTableProps) {
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: '2-digit',
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

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje':
        return '%';
      case 'valor_fijo':
        return '$';
      default:
        return tipo;
    }
  };

  if (!ofertas || ofertas.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No hay ofertas relacionadas
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50 border-b border-neutral-200">
            <TableHead className="text-neutral-700 font-semibold">ID</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Valor</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Unidad</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Creación</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Inicio</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Fin</TableHead>
            <TableHead className="text-neutral-700 font-semibold">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ofertas.map((oferta) => (
            <TableRow key={oferta.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <TableCell className="text-neutral-700 font-medium">{oferta.id}</TableCell>
              <TableCell className="font-mono text-neutral-900">
                {oferta.tipo === 'porcentaje' 
                  ? `${parseFloat(oferta.valor as any).toFixed(0)}` 
                  : `$${formatCurrency(oferta.valor)}`}
              </TableCell>
              <TableCell className="text-neutral-700">
                {getTipoLabel(oferta.tipo)}
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">
                {formatDate(oferta.fecha_creacion)}
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">
                {formatDate(oferta.fecha_inicio)}
              </TableCell>
              <TableCell className="text-neutral-600 text-sm">
                {formatDate(oferta.fecha_fin)}
              </TableCell>
              <TableCell>
                <Badge
                  className={oferta.activa ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}
                >
                  {oferta.activa ? 'activa' : 'inactiva'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
