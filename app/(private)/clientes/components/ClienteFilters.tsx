'use client';

import { Filter, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DebouncedInput from "../../shared/DebouncedInput";

interface ClienteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

export function ClienteFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
}: ClienteFiltersProps) {
  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto items-center">
          <div className="w-full relative flex-1">
            <DebouncedInput
              placeholder="Buscar por nombre, CUIT o teléfono..."
              value={searchTerm}
              onChange={(value) => onSearchChange(value)}
              icon={<Search className="text-neutral-400 h-4 w-4" />}
            />
          </div>
          <Select value={filterType} onValueChange={onFilterTypeChange}>
            <SelectTrigger className="w-full sm:w-30 border-neutral-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tipo</SelectItem>
              <SelectItem value="razon_social">Razón Social</SelectItem>
              <SelectItem value="persona">Persona</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
}
