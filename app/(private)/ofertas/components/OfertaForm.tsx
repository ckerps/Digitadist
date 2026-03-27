"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NuevaOferta, OfertaConProducto, ActualizarOferta } from "@/types/oferta";
import { useProductos } from "../../productos/hooks/useProductos";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface OfertaFormProps {
  oferta?: OfertaConProducto;
  onSubmit: (data: NuevaOferta | ActualizarOferta) => Promise<void>;
  isLoading?: boolean;
}

export function OfertaForm({ oferta, onSubmit, isLoading = false }: OfertaFormProps) {
  const { productos, isLoadingList } = useProductos({ itemsPerPage: 100, currentPage: 1 });
  const [tipo, setTipo] = useState<"monto" | "porcentaje">(
    oferta?.tipo || "porcentaje"
  );
  const [producto_id, setProducto_id] = useState<number | "">(
    oferta?.producto_id || ""
  );
  const [valor, setValor] = useState(oferta?.valor.toString() || "");
  const [fecha_inicio, setFecha_inicio] = useState(
    oferta?.fecha_inicio ? new Date(oferta.fecha_inicio).toISOString().split('T')[0] : ""
  );
  const [fecha_fin, setFecha_fin] = useState(
    oferta?.fecha_fin ? new Date(oferta.fecha_fin).toISOString().split('T')[0] : ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!producto_id || !valor || !fecha_inicio || !fecha_fin) {
      setError("Todos los campos son requeridos");
      return;
    }

    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);

    if (fechaFin <= fechaInicio) {
      setError("La fecha de fin debe ser posterior a la de inicio");
      return;
    }

    try {
      const data = {
        producto_id: Number(producto_id),
        tipo,
        valor: Number(valor),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        ...(oferta && { activa: true }),
      };

      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {oferta ? "Editar Oferta" : "Nueva Oferta"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Producto */}
          <div className="space-y-2">
            <Label htmlFor="producto">Producto *</Label>
            <Select
              value={producto_id.toString()}
              onValueChange={(val) => setProducto_id(Number(val))}
              disabled={isLoadingList || (oferta ? true : false)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {productos?.productos?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Descuento */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Descuento *</Label>
            <Select value={tipo} onValueChange={(val: any) => setTipo(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                <SelectItem value="monto">Monto ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="valor">
              Valor del Descuento {tipo === "porcentaje" ? "(%)" : "($)"} *
            </Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 15"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={fecha_inicio}
                onChange={(e) => setFecha_inicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={fecha_fin}
                onChange={(e) => setFecha_fin(e.target.value)}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : oferta ? "Actualizar" : "Crear"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
