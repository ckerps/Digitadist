'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProductosTable,
  ProductoFilters,
  MobileProductosTable,
  ProductosTableSkeleton,
  MobileProductosTableSkeleton,
} from './components';
import { useProductos } from './hooks/useProductos';
import ErrorPage from '../../error';
import { itemsPerPage } from '../utils';
import { Pagination } from '../shared/Pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [actividadFilter, setActividadFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    nombre: searchTerm.length > 0 ? searchTerm : undefined,
    activo: actividadFilter === 'all' ? undefined : actividadFilter === 'activo',
  };

  const { productos, isLoadingList, errorList } = useProductos({
    itemsPerPage,
    currentPage,
    filters: filters as any,
  });

  const handleRowClick = (id: number) => {
    router.push(`/productos/${id}`);
  };

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleActividadFilterChange = (value: string) => {
    setActividadFilter(value);
    setCurrentPage(1);
  };

  if (errorList) {
    return <ErrorPage message={errorList.message} />;
  }

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Button
          onClick={() => router.push('/productos/nuevo')}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-2 shadow-sm">
        <ProductoFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          actividadFilter={actividadFilter}
          onActividadFilterChange={handleActividadFilterChange}
        />
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        {isLoadingList || !productos ? (
          <>
            <div className='hidden md:block'>
              <ProductosTableSkeleton rows={itemsPerPage} />
            </div>
            <div className='block md:hidden'>
              <MobileProductosTableSkeleton rows={5} />
            </div>
          </>
        ) : (
          <>
            <div className='hidden md:block'>
              <ProductosTable
                productos={(productos?.productos ?? []) as any}
                onRowClick={handleRowClick}
              />
            </div>

            <div className='block md:hidden'>
              <MobileProductosTable
                productos={(productos?.productos ?? []) as any}
                onRowClick={handleRowClick}
              />
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={productos?.totalPages || 1}
          totalItems={productos?.totalItems || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
