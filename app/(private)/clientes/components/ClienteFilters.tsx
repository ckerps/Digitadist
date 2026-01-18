'use client';

import { Filter, Plus, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

interface ClienteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  onNewClienteClick: () => void;
}

export function ClienteFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  onNewClienteClick,
}: ClienteFiltersProps) {
  return (
    <div className="p-2 md:p-4 border-b border-neutral-200">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, CUIT o teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <Select value={filterType} onValueChange={onFilterTypeChange}>
            <SelectTrigger className="w-full sm:w-50 border-neutral-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="razon_social">Razón Social</SelectItem>
              <SelectItem value="persona">Persona</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onNewClienteClick}
          className="bg-red-600 hover:bg-red-700 text-white shadow-md w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>
    </div>
  );
}
