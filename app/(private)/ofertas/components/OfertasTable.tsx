"use client";

import { OfertaConProducto } from "@/types/oferta";
import { DataTable, TableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { RenovarOfertaModal } from "./RenovarOfertaModal";

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

  const columns: TableColumn<OfertaConProducto>[] = [
    { header: "ID", accessorKey: "id", className: "w-[80px] font-medium" },
    { 
      header: "Producto", 
      className: "font-semibold text-foreground",
      cell: (oferta) => oferta.producto?.nombre 
    },
    { 
      header: "Tipo", 
      cell: (oferta) => (
        <Badge 
          variant={oferta.tipo === 'porcentaje' ? 'default' : 'secondary'}
          className={oferta.tipo === 'porcentaje' ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
        >
          {oferta.tipo === "porcentaje" ? "%" : "$"}
        </Badge>
      )
    },
    { 
      header: "Valor", 
      cell: (oferta) => (
        <span className="font-mono text-muted-foreground">
          {oferta.tipo === "porcentaje" ? `${oferta.valor}%` : formatCurrency(oferta.valor)}
        </span>
      )
    },
    { 
      header: "Creación", 
      className: "text-muted-foreground",
      cell: (oferta) => formatDate(oferta.fecha_creacion)
    },
    { 
      header: "Inicio", 
      className: "text-muted-foreground",
      cell: (oferta) => formatDate(oferta.fecha_inicio)
    },
    { 
      header: "Fin", 
      className: "text-muted-foreground",
      cell: (oferta) => formatDate(oferta.fecha_fin)
    },
    { 
      header: "Estado", 
      cell: (oferta) => (
        <Badge
          variant={oferta.activa ? "default" : "secondary"}
          className={oferta.activa ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
        >
          {oferta.activa ? "Activa" : "Inactiva"}
        </Badge>
      )
    },
    {
      header: "Acciones",
      cell: (oferta) => (
        <div onClick={(e) => e.stopPropagation()}>
          <RenovarOfertaModal ofertaId={oferta.id} onRenewComplete={() => window.location.reload()} />
        </div>
      )
    }
  ];

  return (
    <DataTable 
      data={ofertas || []} 
      columns={columns} 
      onRowClick={(o) => {
        if (onRowClick) {
          onRowClick(o.id);
        } else {
          window.location.href = `/ofertas/${o.id}`;
        }
      }} 
      rowKey={(o) => o.id}
    />
  );
}
