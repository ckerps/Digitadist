'use client';

import { Pedido } from "@/types/pedido";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "lucide-react";



interface PedidosTableProps {
  pedidos: Pedido[];
}

export function PedidosTable({ pedidos }: PedidosTableProps) {
  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      entregado: { label: 'Entregado', className: 'bg-green-600 hover:bg-green-700' },
      registrado: { label: 'Registrado', className: 'bg-blue-600 hover:bg-blue-700' },
      finalizado: { label: 'Finalizado', className: 'bg-neutral-600 hover:bg-neutral-700' },
      en_preparacion: { label: 'En Preparación', className: 'bg-amber-600 hover:bg-amber-700' },
    };
    return variants[estado] || variants.registrado;
  };

  const getPagoBadge = (pago: string) => {
    return pago === 'pagado'
      ? { label: 'Pagado', className: 'bg-green-600 hover:bg-green-700' }
      : { label: 'En Deuda', className: 'bg-red-600 hover:bg-red-700' };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100 hover:bg-neutral-100">
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">ID</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Dirección Entrega</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Fecha Estimada</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Estado</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Pago</TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => {
            const estadoBadge = getEstadoBadge(pedido.estado);
            const pagoBadge = getPagoBadge(pedido.pago);
            return (
              <TableRow key={pedido.id} className="hover:bg-red-50 transition-colors duration-150">
                <TableCell className="px-6 py-4 text-sm font-medium text-neutral-900">{pedido.id}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-neutral-600">{pedido.direccionEntrega}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-neutral-600">{pedido.fechaEstimada}</TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className={estadoBadge.className}>
                    {estadoBadge.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge className={pagoBadge.className}>
                    {pagoBadge.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-semibold text-neutral-900 text-right">
                  ${pedido.total.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

