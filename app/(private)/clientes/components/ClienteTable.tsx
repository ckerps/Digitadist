'use client';

import { Cliente } from "@/types/cliente";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Building2, User } from "lucide-react";


interface ClienteTableProps {
  clientes: Cliente[];
  onRowClick: (id: number) => void;
}

export function ClienteTable({ clientes, onRowClick }: ClienteTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-900 hover:bg-neutral-900">
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">ID</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">Tipo</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">Dirección</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">CUIT</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-white">Teléfono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow
              key={cliente.id}
              onClick={() => onRowClick(cliente.id)}
              className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
            >
              <TableCell className="px-6 py-4 text-sm font-medium text-neutral-900">{cliente.id}</TableCell>
              <TableCell className="px-6 py-4">
                <Badge
                  variant={cliente.tipo === 'razon_social' ? 'default' : 'secondary'}
                  className={cliente.tipo === 'razon_social' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {cliente.tipo === 'razon_social' ? (
                    <><Building2 className="h-3 w-3 mr-1" /> Razón Social</>
                  ) : (
                    <><User className="h-3 w-3 mr-1" /> Persona</>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm text-neutral-900 font-medium">{cliente.nombre}</TableCell>
              <TableCell className="px-6 py-4 text-sm text-neutral-600">{cliente.direccion}</TableCell>
              <TableCell className="px-6 py-4 text-sm text-neutral-600 font-mono">{cliente.cuit}</TableCell>
              <TableCell className="px-6 py-4 text-sm text-neutral-600">{cliente.telefono}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
