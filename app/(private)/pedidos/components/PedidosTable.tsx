'use client';

import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { getEstadoBadge, getPagoBadge } from "./utils";
import { Pedido } from "@/types/pedido";
import React from "react";

interface PedidosTableProps {
  pedidos: Pedido[];
  onRowClick?: (id: number) => void;
}

export function PedidosTable({ pedidos, onRowClick }: PedidosTableProps) {
  const columns: TableColumn<Pedido>[] = [
    { header: "ID", accessorKey: "id", className: "w-[80px] font-medium" },
    { header: "Dirección Entrega", accessorKey: "direccion_entrega", className: "text-muted-foreground" },
    {
      header: "Fecha Estimada",
      cell: (pedido) => <span className="text-muted-foreground">{pedido.fecha_entrega_estimada.toLocaleString().split("T")[0]}</span>
    },
    {
      header: "Estado",
      cell: (pedido) => {
        const estadoBadge = getEstadoBadge(pedido.estado);
        return <Badge className={estadoBadge.className}>{estadoBadge.label}</Badge>;
      }
    },
    {
      header: "Pago",
      cell: (pedido) => {
        const pagoBadge = getPagoBadge(pedido.estado_pago);
        return <Badge className={pagoBadge.className}>{pagoBadge.label}</Badge>;
      }
    },
    {
      header: "Total",
      cell: (pedido) => <span className="font-semibold text-foreground text-right block w-full">${pedido.total.toFixed(2)}</span>,
      className: "text-right"
    }
  ];

  return (
    <DataTable
      data={pedidos || []}
      columns={columns}
      onRowClick={onRowClick ? (p) => onRowClick(p.id) : undefined}
      rowKey={(p) => p.id}
    />
  );
}

