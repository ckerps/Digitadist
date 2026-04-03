'use client';

import { Search, Filter } from 'lucide-react';
import DebouncedInput from '../../shared/DebouncedInput';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface UsuarioFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onFilterRoleChange: (value: string) => void;
}

export function UsuarioFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
}: UsuarioFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <DebouncedInput
            placeholder="Buscar por nombre, apellido o email..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 border-neutral-200"
          />
        </div>
      </div>
      <div className="min-w-[180px]">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4 z-10 pointer-events-none" />
          <Select value={filterRole} onValueChange={onFilterRoleChange}>
            <SelectTrigger className="pl-10 border-neutral-200">
              <SelectValue placeholder="Filtrar por Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="1">Admin</SelectItem>
              <SelectItem value="2">Vendedor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
