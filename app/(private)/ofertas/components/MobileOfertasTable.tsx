"use client";

import { OfertaConProducto } from "@/types/oferta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-3">
      {(ofertas || []).map((oferta) => (
        <Card
          key={oferta.id}
          className="hover:bg-accent cursor-pointer transition-colors duration-200 border-border/60 shadow-xs"
          onClick={() => {
            if (onCardClick) {
              onCardClick(oferta.id);
            } else {
              window.location.href = `/ofertas/${oferta.id}`;
            }
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-base font-semibold">{oferta.id} - {oferta.producto.nombre}</CardTitle>
              <Badge
                variant={oferta.activa ? "default" : "secondary"}
                className={
                  oferta.activa
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-muted text-muted-foreground"
                }
              >
                {oferta.activa ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 text-sm flex flex-col gap-1 text-muted-foreground">
            <div><strong className="font-medium text-foreground">Descuento:</strong> {oferta.tipo === "porcentaje"
              ? `${oferta.valor}%`
              : formatCurrency(oferta.valor)}
            </div>
            <div className="flex justify-between">
              <div><strong className="font-medium text-foreground">Inicio:</strong> {formatDate(oferta.fecha_inicio)}</div>
              <div><strong className="font-medium text-foreground">Fin:</strong> {formatDate(oferta.fecha_fin)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
