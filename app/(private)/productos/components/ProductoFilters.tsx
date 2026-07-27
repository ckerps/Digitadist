'use client';

import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DebouncedInput from "../../shared/DebouncedInput";

interface ProductoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actividadFilter: string;
  onActividadFilterChange: (value: string) => void;
}

export function ProductoFilters({
  searchTerm,
  onSearchChange,
  actividadFilter,
  onActividadFilterChange,
}: ProductoFiltersProps) {
  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto items-center">
          <div className="w-full relative flex-1">
            <DebouncedInput
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(value) => onSearchChange(value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
            />
          </div>
          <Select value={actividadFilter} onValueChange={onActividadFilterChange}>
            <SelectTrigger className="w-full sm:w-40 border-neutral-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Estado</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
