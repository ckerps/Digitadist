'use client';

import { Filter, Plus, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

interface PedidoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  estadoFilter: string;
  onEstadoFilterChange: (value: string) => void;
  pagoFilter: string;
  onPagoFilterChange: (value: string) => void;
  onNewPedidoClick: () => void;
}

export function PedidoFilters({
  searchTerm,
  onSearchChange,
  estadoFilter,
  onEstadoFilterChange,
  pagoFilter,
  onPagoFilterChange,
  onNewPedidoClick,
}: PedidoFiltersProps) {
  return (
    <div className="p-2 md:p-4 border-b border-neutral-200">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre de cliente o ID"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <Select value={estadoFilter} onValueChange={onEstadoFilterChange}>
            <SelectTrigger className="w-full sm:w-50 border-neutral-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="registrado">Registrado</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
              <SelectItem value="en_preparacion">En Preparación</SelectItem>
            </SelectContent>
          </Select>
          <Select value={pagoFilter} onValueChange={onPagoFilterChange}>
            <SelectTrigger className="w-full sm:w-50 border-neutral-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="en_deuda">En Deuda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onNewPedidoClick}
          className="bg-red-600 hover:bg-red-700 text-white shadow-md w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </div>
    </div>
  );
}
