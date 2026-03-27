'use client';

import { Producto, EnumPresentacion } from "@prisma/client";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ProductosTableProps {
  productos: Producto[];
  onRowClick: (id: number) => void;
}

const getPresentacionLabel = (presentacion: EnumPresentacion): string => {
  const labels: Record<EnumPresentacion, string> = {
    gramos: 'GR',
    litros: 'LT',
  };
  return labels[presentacion] || presentacion;
};

export function ProductosTable({ productos, onRowClick }: ProductosTableProps) {
  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  };

  const getPrecioLista = (costo: any, recargo: number) => {
    const costoNum = parseFloat(costo);
    return costoNum * (1 + recargo / 100);
  };

  const columns: TableColumn<Producto>[] = [
    // { header: "ID", accessorKey: "id", className: "w-[80px] font-medium" },
    { header: "Nombre", accessorKey: "nombre", className: "font-medium max-w-xs truncate" },
    {
      header: "Stock",
      className: "text-center",
      cell: (producto) => {
        const hasStock = producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo;
        return (
          <Badge
            variant={hasStock ? 'default' : 'destructive'}
            className={hasStock ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-destructive hover:bg-destructive/90 text-white'}
          >
            {producto.stock_actual}
          </Badge>
        );
      }
    },
    {
      header: "Costo",
      className: "text-right",
      cell: (producto) => `$${formatCurrency(producto.costo)}`
    },
    {
      header: "Precio unitario",
      className: "text-center",
      cell: (producto) => `$${formatCurrency(getPrecioLista(producto.costo, producto.porcentaje_recargo))}`
    },
    {
      header: "Vencimiento",
      className: "text-center",
      cell: (producto) => formatDate(producto.fecha_vencimiento)
    },
    {
      header: "Presentación",
      className: "text-center",
      cell: (producto) => (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {getPresentacionLabel(producto.presentacion)}
        </Badge>
      )
    },
    {
      header: "Estado",
      className: "text-center",
      cell: (producto) => (
        <Badge variant={producto.activo ? 'default' : 'secondary'} className={producto.activo ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-secondary hover:bg-secondary/90 text-white'}>
          {producto.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    }
  ];

  return (
    <DataTable
      data={productos || []}
      columns={columns}
      onRowClick={(p) => onRowClick(p.id)}
      rowKey={(p) => p.id}
    />
  );
}
