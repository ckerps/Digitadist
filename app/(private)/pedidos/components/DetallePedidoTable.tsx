'use client';

import { DetallePedido, Producto } from "@prisma/client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface DetallePedidoTableProps {
  productos: (DetallePedido & { producto: Producto })[];
  onDeleteProducto?: (productoId: number, pedidoId: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DetallePedidoTable({ productos, onDeleteProducto, isDeleting }: DetallePedidoTableProps) {
  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const totalSubtotal = productos.reduce((acc, item) => {
    return acc + parseFloat(item.subtotal as any);
  }, 0);

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Productos incluidos en el pedido.</TableCaption>
        <TableHeader>
          <TableRow className="bg-neutral-100 hover:bg-neutral-100">
            <TableHead className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-neutral-900">Producto</TableHead>
            <TableHead className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-neutral-900">Código</TableHead>
            <TableHead className="px-4 lg:px-6 py-3 text-center text-sm font-semibold text-neutral-900">Cantidad</TableHead>
            <TableHead className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-neutral-900">Precio Unitario</TableHead>
            <TableHead className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-neutral-900">Descuento</TableHead>
            <TableHead className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-neutral-900">Subtotal</TableHead>
            {onDeleteProducto && <TableHead className="px-4 lg:px-6 py-3 text-center text-sm font-semibold text-neutral-900">Acción</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((item) => (
            <TableRow key={`${item.pedido_id}-${item.producto_id}`} className="hover:bg-neutral-50">
              <TableCell className="px-4 lg:px-6 py-3 text-sm font-medium text-neutral-900">{item.producto.nombre}</TableCell>
              <TableCell className="px-4 lg:px-6 py-3 text-sm text-neutral-600">{item.producto.codigo}</TableCell>
              <TableCell className="px-4 lg:px-6 py-3 text-sm text-center text-neutral-600">{item.cantidad}</TableCell>
              <TableCell className="px-4 lg:px-6 py-3 text-sm text-right text-neutral-600">${formatCurrency(item.precio_unitario)}</TableCell>
              <TableCell className="px-4 lg:px-6 py-3 text-sm text-right text-neutral-600">
                {item.descuento ? `-$${formatCurrency(item.descuento)}` : '-'}
              </TableCell>
              <TableCell className="px-4 lg:px-6 py-3 text-sm font-semibold text-right text-neutral-900">${formatCurrency(item.subtotal)}</TableCell>
              {onDeleteProducto && (
                <TableCell className="px-4 lg:px-6 py-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteProducto(item.producto_id, item.pedido_id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-neutral-100">
            <TableCell colSpan={onDeleteProducto ? 5 : 5} className="px-4 lg:px-6 py-3 text-right font-semibold text-neutral-900">Total</TableCell>
            <TableCell className="px-4 lg:px-6 py-3 text-right font-bold text-neutral-900">${formatCurrency(totalSubtotal)}</TableCell>
            {onDeleteProducto && <TableCell></TableCell>}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
