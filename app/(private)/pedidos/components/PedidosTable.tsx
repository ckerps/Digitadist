'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { getEstadoBadge, getPagoBadge } from "./utils";
import { Pedido } from "@/types/pedido";

interface PedidosTableProps {
  pedidos: Pedido[];
  onRowClick?: (id: number) => void;
}

export function PedidosTable({ pedidos, onRowClick }: PedidosTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100 hover:bg-neutral-100">
            <TableHead className="px-4 lg:px-6 py-2 text-left text-sm font-semibold text-neutral-900">ID</TableHead>
            <TableHead className="px-4 lg:px-6 py-2 text-left text-sm font-semibold text-neutral-900">Dirección Entrega</TableHead>
            <TableHead className="px-4 lg:px-6 py-2 text-left text-sm font-semibold text-neutral-900">Fecha Estimada</TableHead>
            <TableHead className="px-4 lg:px-6 py-2 text-left text-sm font-semibold text-neutral-900">Estado</TableHead>
            <TableHead className="px-4 lg:px-6 py-2 text-left text-sm font-semibold text-neutral-900">Pago</TableHead>
            <TableHead className="px-4 lg:px-6 py-2 text-right text-sm font-semibold text-neutral-900">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="px-4 lg:px-6 py-4 text-center text-sm text-neutral-600">
                No se encontraron pedidos.
              </TableCell>
            </TableRow>
          ) : 
          pedidos.map((pedido) => {
            const estadoBadge = getEstadoBadge(pedido.estado);
            const pagoBadge = getPagoBadge(pedido.estado_pago);
            return (
              <TableRow key={pedido.id} className="hover:bg-red-50 transition-colors duration-150" onClick={onRowClick ? () => onRowClick(pedido.id) : undefined}>
                <TableCell className="px-4 lg:px-6 py-2 text-sm font-medium text-neutral-900">{pedido.id}</TableCell>
                <TableCell className="px-4 lg:px-6 py-2 text-sm text-neutral-600">{pedido.direccion_entrega}</TableCell>
                <TableCell className="px-4 lg:px-6 py-2 text-sm text-neutral-600">{pedido.fecha_entrega_estimada.toLocaleString()}</TableCell>
                <TableCell className="px-4 lg:px-6 py-2">
                  <Badge className={estadoBadge.className}>
                    {estadoBadge.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 lg:px-6 py-2">
                  <Badge className={pagoBadge.className}>
                    {pagoBadge.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 lg:px-6 py-2 text-sm font-semibold text-neutral-900 text-right">
                  ${pedido.total}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

