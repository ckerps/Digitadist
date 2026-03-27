"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltrosOferta } from "@/types/oferta";
import { Plus } from "lucide-react";

interface FiltrosOfertasProps {
  onApplyFiltros: (filtros: FiltrosOferta) => void;
  onReset: () => void;
}

export function FiltrosOfertas({ onApplyFiltros, onReset }: FiltrosOfertasProps) {
  const [id, setId] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [fecha_inicio_desde, setFechaInicioDde] = useState("");
  const [fecha_inicio_hasta, setFechaInicioHasta] = useState("");
  const [fecha_fin_desde, setFechaFinDde] = useState("");
  const [fecha_fin_hasta, setFechaFinHasta] = useState("");

  const handleApply = () => {
    const filtros: FiltrosOferta = {};

    if (id) filtros.id = Number(id);
    if (tipo) filtros.tipo = tipo as any;
    if (estado) filtros.estado = estado as any;
    if (fecha_inicio_desde) filtros.fecha_inicio_desde = fecha_inicio_desde;
    if (fecha_inicio_hasta) filtros.fecha_inicio_hasta = fecha_inicio_hasta;
    if (fecha_fin_desde) filtros.fecha_fin_desde = fecha_fin_desde;
    if (fecha_fin_hasta) filtros.fecha_fin_hasta = fecha_fin_hasta;

    onApplyFiltros(filtros);
  };

  const handleReset = () => {
    setId("");
    setTipo("");
    setEstado("");
    setFechaInicioDde("");
    setFechaInicioHasta("");
    setFechaFinDde("");
    setFechaFinHasta("");
    onReset();
  };

  return (
    <div className="p-2 md:p-4 border-b border-neutral-200 align-baseline">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-end justify-between align-baseline">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto ">
          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="porcentaje">Porcentaje</SelectItem>
                <SelectItem value="monto">Monto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rango de Fechas de Inicio */}
        <div>
          <p className="font-semibold text-sm">Fecha de Inicio</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio_desde">Desde</Label>
              <Input
                id="fecha_inicio_desde"
                type="date"
                value={fecha_inicio_desde}
                onChange={(e) => setFechaInicioDde(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio_hasta">Hasta</Label>
              <Input
                id="fecha_inicio_hasta"
                type="date"
                value={fecha_inicio_hasta}
                onChange={(e) => setFechaInicioHasta(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Rango de Fechas de Fin */}
        <div>
          <p className="font-semibold text-sm">Fecha de Fin (Vencimiento)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_fin_desde">Desde</Label>
              <Input
                id="fecha_fin_desde"
                type="date"
                value={fecha_fin_desde}
                onChange={(e) => setFechaFinDde(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_fin_hasta">Hasta</Label>
              <Input
                id="fecha_fin_hasta"
                type="date"
                value={fecha_fin_hasta}
                onChange={(e) => setFechaFinHasta(e.target.value)}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
