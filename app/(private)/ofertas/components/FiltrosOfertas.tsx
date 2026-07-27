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
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { format } from "date-fns";

interface FiltrosOfertasProps {
  onApplyFiltros: (filtros: FiltrosOferta) => void;
  onReset: () => void;
}

export function FiltrosOfertas({ onApplyFiltros, onReset }: FiltrosOfertasProps) {
  const [id, setId] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [rangeInicio, setRangeInicio] = useState<DateRange | undefined>();
  const [rangeFin, setRangeFin] = useState<DateRange | undefined>();

  const handleApply = () => {
    const filtros: FiltrosOferta = {};

    if (id) filtros.id = Number(id);
    if (tipo !== "todos") filtros.tipo = tipo as any;
    if (estado !== "todos") filtros.estado = estado as any;

    if (rangeInicio?.from) filtros.fecha_inicio_desde = format(rangeInicio.from, "yyyy-MM-dd");
    if (rangeInicio?.to) filtros.fecha_inicio_hasta = format(rangeInicio.to, "yyyy-MM-dd");

    if (rangeFin?.from) filtros.fecha_fin_desde = format(rangeFin.from, "yyyy-MM-dd");
    if (rangeFin?.to) filtros.fecha_fin_hasta = format(rangeFin.to, "yyyy-MM-dd");

    onApplyFiltros(filtros);
  };

  const handleReset = () => {
    setId("");
    setTipo("todos");
    setEstado("todos");
    setRangeInicio(undefined);
    setRangeFin(undefined);
    onReset();
  };


  return (
    <div className="p-2 md:p-4 border-b border-neutral-200">
      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
        {/* Tipo */}

        <div className="flex gap-3 w-full">
          <div className="space-y-2 w-full lg:w-auto">
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
          <div className="space-y-2 w-full lg:w-auto">
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

        <div className="flex gap-3 w-full">
          {/* Rango de Fechas de Inicio */}
          <div className="flex-1 w-full lg:w-auto">
            <Label className="mb-2 block">Fecha de Inicio</Label>
            <DatePickerWithRange
              date={rangeInicio}
              setDate={setRangeInicio}
              placeholder="Desde - Hasta"
            />
          </div>

          {/* Rango de Fechas de Fin */}
          <div className="flex-1 w-full lg:w-auto">
            <Label className="mb-2 block">Fecha de Fin</Label>
            <DatePickerWithRange
              date={rangeFin}
              setDate={setRangeFin}
              placeholder="Desde - Hasta"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <Button onClick={handleApply} className="bg-red-600 hover:bg-red-700 text-white flex-1 lg:flex-none">
            Buscar
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1 lg:flex-none">
            Limpiar
          </Button>
        </div>
      </div>

    </div>
  );
}
