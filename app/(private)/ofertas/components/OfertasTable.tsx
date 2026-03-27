"use client";

import { OfertaConProducto } from "@/types/oferta";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";

interface OfertasTableProps {
  ofertas: OfertaConProducto[];
  onRowClick?: (id: number) => void;
}

export function OfertasTable({ ofertas, onRowClick }: OfertasTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">ID</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Producto</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Tipo</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Valor</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Creación</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Inicio</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Fin</TableHead>
            <TableHead className="px-6 py-2 text-left text-sm font-semibold text-white">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ofertas.map((oferta) => (
          <TableRow
            key={oferta.id}
            className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
            onClick={() => {
              if (onRowClick) {
                onRowClick(oferta.id);
              } else {
                window.location.href = `/ofertas/${oferta.id}`;
              }
            }}
          >
            <TableCell className="px-6 py-2 text-sm font-medium text-neutral-900">{oferta.id}</TableCell>
            <TableCell className="px-6 py-2 text-sm font-medium text-neutral-900">{oferta.producto.nombre}</TableCell>
            <TableCell className="px-6 py-2">
                <Badge 
                  variant={oferta.tipo === 'porcentaje' ? 'default' : 'secondary'}
                  className={oferta.tipo === 'porcentaje' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {oferta.tipo === "porcentaje" ? "%" : "$"}
                </Badge>
            </TableCell>
            <TableCell>
              {oferta.tipo === "porcentaje"
                ? `${oferta.valor}%`
                : formatCurrency(oferta.valor)}
            </TableCell>
            <TableCell className="px-6 py-2 text-sm font-medium text-neutral-900">{formatDate(oferta.fecha_creacion)}</TableCell>
            <TableCell className="px-6 py-2 text-sm font-medium text-neutral-900">{formatDate(oferta.fecha_inicio)}</TableCell>
            <TableCell className="px-6 py-2 text-sm font-medium text-neutral-900">{formatDate(oferta.fecha_fin)}</TableCell>
            <TableCell>
              <Badge
                variant={oferta.activa ? "default" : "secondary"}
                className={
                  oferta.activa
                    ? 'bg-red-600 hover:bg-red-700' : ''
                }
              >
                {oferta.activa ? "Activa" : "Inactiva"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
