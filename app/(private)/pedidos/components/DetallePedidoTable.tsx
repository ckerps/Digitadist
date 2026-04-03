'use client';

import { DetallePedido, Producto } from "@prisma/client";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetallePedidoTableProps {
  productos: (DetallePedido & { producto: Producto })[];
  onEditarCantidad?: (detalle: DetallePedido & { producto: Producto }) => void;
  onDeleteProducto?: (productoId: number, pedidoId: number) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function DetallePedidoTable({
  productos,
  onEditarCantidad,
  onDeleteProducto,
  isDeleting,
  isUpdating
}: DetallePedidoTableProps) {
  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const totalSubtotal = productos.reduce((acc, item) => {
    return acc + parseFloat(item.subtotal as any);
  }, 0);

  const hasActions = onEditarCantidad || onDeleteProducto;

  const columns: TableColumn<DetallePedido & { producto: Producto }>[] = [
    { header: "Producto", className: "font-medium", cell: (item) => item.producto.nombre },
    { header: "Código", className: "text-muted-foreground", cell: (item) => item.producto.codigo },
    { header: "Cantidad", className: "text-center", accessorKey: "cantidad" },
    { header: "Costo", className: "text-right", cell: (item) => `$${formatCurrency(item.producto.costo)}` },
    { header: "Precio Unitario", className: "text-right", cell: (item) => `$${formatCurrency(item.precio_unitario)}` },
    { header: "Descuento", className: "text-right text-muted-foreground", cell: (item) => item.descuento ? `-$${formatCurrency(item.descuento)}` : '-' },
    { header: "Subtotal", className: "text-right font-semibold", cell: (item) => `$${formatCurrency(item.subtotal)}` }
  ];

  if (hasActions) {
    columns.push({
      header: "Acciones",
      className: "text-center",
      cell: (item) => (
        <div className="flex gap-2 justify-center">
          {onEditarCantidad && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onEditarCantidad(item); }}
              disabled={isUpdating}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Editar cantidad"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDeleteProducto && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDeleteProducto(item.producto_id, item.pedido_id); }}
              disabled={isDeleting || isUpdating}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    });
  }

  const footer = (
    <tr>
      <td colSpan={hasActions ? 7 : 6} className="p-4 align-middle text-right font-semibold text-foreground">Total</td>
      <td className="p-4 align-middle text-right font-bold text-foreground">${formatCurrency(totalSubtotal)}</td>
    </tr>
  );

  return (
    <DataTable
      data={productos || []}
      columns={columns}
      footer={footer}
      rowKey={(item) => `${item.pedido_id}-${item.producto_id}`}
    />
  );
}
