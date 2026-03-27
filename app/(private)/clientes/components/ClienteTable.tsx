'use client';

import { Cliente } from "@/types/cliente";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";
import React from "react";

interface ClienteTableProps {
  clientes: Cliente[];
  onRowClick: (id: number) => void;
}

export function ClienteTable({ clientes, onRowClick }: ClienteTableProps) {
  const columns: TableColumn<Cliente>[] = [
    { header: "ID", accessorKey: "id", className: "w-[80px] font-medium" },
    { 
      header: "Tipo", 
      cell: (cliente) => (
        <Badge
          variant={cliente.tipo === 'razon_social' ? 'default' : 'secondary'}
          className={cliente.tipo === 'razon_social' ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
        >
          {cliente.tipo === 'razon_social' ? (
            <span className="flex items-center"><Building2 className="h-3 w-3 mr-1" /> Razón Social</span>
          ) : (
            <span className="flex items-center"><User className="h-3 w-3 mr-1" /> Persona</span>
          )}
        </Badge>
      )
    },
    { header: "Nombre", accessorKey: "nombre", className: "font-semibold text-foreground" },
    { header: "Dirección", accessorKey: "direccion", className: "text-muted-foreground" },
    { header: "CUIT", accessorKey: "cuit", className: "text-muted-foreground font-mono" },
    { header: "Teléfono", accessorKey: "telefono", className: "text-muted-foreground" }
  ];

  return (
    <DataTable 
      data={clientes} 
      columns={columns} 
      onRowClick={(c) => onRowClick(c.id)} 
      rowKey={(c) => c.id}
    />
  );
}
