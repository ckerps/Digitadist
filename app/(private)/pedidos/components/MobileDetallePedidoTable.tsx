'use client';

import { DetallePedido, Producto } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileDetallePedidoTableProps {
  productos: (DetallePedido & { producto: Producto })[];
  onEditarCantidad?: (detalle: DetallePedido & { producto: Producto }) => void;
  onDeleteProducto?: (productoId: number, pedidoId: number) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function MobileDetallePedidoTable({ 
  productos, 
  onEditarCantidad,
  onDeleteProducto, 
  isDeleting,
  isUpdating
}: MobileDetallePedidoTableProps) {
  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const totalSubtotal = productos?.reduce((acc, item) => {
    return acc + parseFloat(item.subtotal as any);
  }, 0) || 0;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {productos?.map((item) => (
        <Card key={`${item.pedido_id}-${item.producto_id}`} className="border-neutral-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base text-neutral-900">{item.producto.nombre}</CardTitle>
              <p className="text-xs text-neutral-500 mt-1">Código: {item.producto.codigo}</p>
            </div>
            <div className="flex gap-2">
              {onEditarCantidad && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditarCantidad(item)}
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
                  onClick={() => onDeleteProducto(item.producto_id, item.pedido_id)}
                  disabled={isDeleting || isUpdating}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Eliminar producto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Cantidad:</span>
              <span className="font-medium text-neutral-900">{item.cantidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Precio Unitario:</span>
              <span className="font-medium text-neutral-900">${formatCurrency(item.precio_unitario)}</span>
            </div>
            {item.descuento && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Descuento:</span>
                <span className="font-medium text-red-600">-${formatCurrency(item.descuento)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-200 pt-2">
              <span className="font-semibold text-neutral-900">Subtotal:</span>
              <span className="font-bold text-neutral-900">${formatCurrency(item.subtotal)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-neutral-900">Total:</span>
          <span className="text-xl font-bold text-neutral-900">${formatCurrency(totalSubtotal)}</span>
        </div>
      </div>
    </div>
  );
}
