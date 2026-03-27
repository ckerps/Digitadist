'use client';

import { Filter, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DebouncedInput from "../../shared/DebouncedInput";
import { EnumEstadoPago, EnumEstadoPedido } from "@prisma/client";
import { FiltrosPedido } from "@/types/pedido";

interface PedidoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filtros: FiltrosPedido;
  onEstadoFilterChange: (value: string) => void;
  onPagoFilterChange: (value: string) => void;
}

export function PedidoFilters({
  searchTerm,
  onSearchChange,
  filtros,
  onEstadoFilterChange,
  onPagoFilterChange,
}: PedidoFiltersProps) {
  return (
    <div className="p-2 md:p-4">
      <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto items-center">
        <div className="relative flex-1">
          <DebouncedInput
            icon={<Search className="h-4 w-4" />}
            placeholder="Buscar por nombre de cliente, ID o email..."
            value={searchTerm}
            onChange={(value) => onSearchChange(value)}
          />
        </div>
        <Select value={filtros.estado ?? 'all'} onValueChange={onEstadoFilterChange}>
          <SelectTrigger className="w-full sm:w-30 border-neutral-300">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Estado</SelectItem>
            <SelectItem value={EnumEstadoPedido.entregado}>Entregado</SelectItem>
            <SelectItem value={EnumEstadoPedido.registrado}>Registrado</SelectItem>
            <SelectItem value={EnumEstadoPedido.finalizado}>Finalizado</SelectItem>
            <SelectItem value={EnumEstadoPedido.en_preparacion}>En Preparación</SelectItem>
            <SelectItem value={EnumEstadoPedido.cancelado}>Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtros?.estado_pago ?? 'all'} onValueChange={onPagoFilterChange}>
          <SelectTrigger className="w-full sm:w-30 border-neutral-300">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Pago</SelectItem>
            <SelectItem value={EnumEstadoPago.pagado}>Pagado</SelectItem>
            <SelectItem value={EnumEstadoPago.en_deuda}>En Deuda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

