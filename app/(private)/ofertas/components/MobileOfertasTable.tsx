"use client";

import { OfertaConProducto } from "@/types/oferta";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface MobileOfertasTableProps {
  ofertas: OfertaConProducto[];
  onCardClick?: (id: number) => void;
}

export function MobileOfertasTable({ ofertas, onCardClick }: MobileOfertasTableProps) {
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
    <div className="overflow-x-auto grid gap-2">
      {ofertas.map((oferta) => (
        <Card
          key={oferta.id}
          className="hover:bg-red-50 cursor-pointer transition-colors duration-150"
          onClick={() => {
            if (onCardClick) {
              onCardClick(oferta.id);
            } else {
              window.location.href = `/ofertas/${oferta.id}`;
            }
          }}
        >
          <CardHeader>
            <CardTitle>{oferta.id} - {oferta.producto.nombre}</CardTitle>
            <Badge
              variant={oferta.activa ? "default" : "secondary"}
              className={
                oferta.activa
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {oferta.activa ? "Activa" : "Inactiva"}
            </Badge>
          </CardHeader>

          <CardContent >
            <div className="text-neutral-600">Descuento: {oferta.tipo === "porcentaje"
              ? `${oferta.valor}%`
              : formatCurrency(oferta.valor)}
            </div>
            <div className="text-neutral-600">Inicio: {formatDate(oferta.fecha_inicio)}</div>
            <div className="text-neutral-600">Fin: {formatDate(oferta.fecha_fin)}</div>
            <div className="text-neutral-600">Creada: {formatDate(oferta.fecha_creacion)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
