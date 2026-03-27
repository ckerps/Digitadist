'use client';

import { Producto, EnumPresentacion } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Package } from "lucide-react";

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

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">ID</TableHead>
            <TableHead className="px-6 py-3 text-left text-sm font-semibold text-white">Nombre</TableHead>
            <TableHead className="px-6 py-3 text-center text-sm font-semibold text-white">Stock</TableHead>
            <TableHead className="px-6 py-3 text-right text-sm font-semibold text-white">Costo</TableHead>
            <TableHead className="px-6 py-3 text-right text-sm font-semibold text-white">Precio lista</TableHead>
            <TableHead className="px-6 py-3 text-center text-sm font-semibold text-white">Vencimiento</TableHead>
            <TableHead className="px-6 py-3 text-center text-sm font-semibold text-white">Presentación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow
              key={producto.id}
              onClick={() => onRowClick(producto.id)}
              className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
            >
              <TableCell className="px-6 py-3 text-sm font-medium text-neutral-900">{producto.id}</TableCell>
              <TableCell className="px-6 py-3 text-sm text-neutral-900 font-medium max-w-xs truncate">
                {producto.nombre}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-center">
                <Badge
                  variant={producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo ? 'default' : 'destructive'}
                  className={
                    producto.stock_actual && producto.stock_minimo && producto.stock_actual > producto.stock_minimo
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {producto.stock_actual}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-right text-neutral-600 font-mono">
                ${formatCurrency(producto.costo)}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-right text-neutral-600 font-mono">
                ${formatCurrency(getPrecioLista(producto.costo, producto.porcentaje_recargo))}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-center text-neutral-600">
                {formatDate(producto.fecha_vencimiento)}
              </TableCell>
              <TableCell className="px-6 py-3 text-center">
                <Badge variant="secondary" className="bg-neutral-200 text-neutral-700">
                  {getPresentacionLabel(producto.presentacion)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
