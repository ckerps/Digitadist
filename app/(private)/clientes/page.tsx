'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClienteTable,
  ClienteFilters,
  MobileClienteTable,
  ClienteTableSkeleton,
  MobileClienteTableSkeleton,
  NuevoClienteModal,
} from './components';
import { useClientes } from './hooks/useClientes';
import { NuevoCliente } from '@/types/cliente';
import ErrorPage from '../../error';
import { itemsPerPage } from '../utils';
import { Pagination } from '../shared/Pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClientesPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Construir filtros dinámicamente
  const filters: any = {};
  if (searchTerm.length > 0) filters.searchTerm = searchTerm;
  if (filterType !== 'all') filters.tipo = filterType;

  const { clientes, isLoadingList, errorList, createCliente } = useClientes({
    itemsPerPage,
    currentPage,
    filters: Object.keys(filters).length > 0 ? filters : undefined
  });

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleRowClick = (id: number) => {
    router.push(`/clientes/${id}`);
  };

  const handleSaveCliente = async (cliente: NuevoCliente) => {
    await createCliente(cliente);
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  if (errorList) {
    return (
      <ErrorPage message={errorList.message} />
    );
  }

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestioná tu agenda de clientes</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-2 shadow-sm">
        <ClienteFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterType={filterType}
          onFilterTypeChange={handleFilterTypeChange}
        />
      </div>

      {/* Data Table Section */}
      <div className="overflow-hidden">
        {isLoadingList || !clientes ? (
          <>
            <div className='hidden md:block bg-white border border-neutral-200 rounded-lg shadow-sm'>
              <ClienteTableSkeleton rows={itemsPerPage} />
            </div>
            <div className='block md:hidden'>
              <MobileClienteTableSkeleton rows={5} />
            </div>
          </>
        ) : (
          <>
            <div className='hidden md:block bg-white border border-neutral-200 rounded-lg shadow-sm'>
              <ClienteTable
                clientes={clientes?.clientes ?? []}
                onRowClick={handleRowClick}
              />
            </div>

            <div className='block mt-2 md:mt-0 md:hidden'>
              <MobileClienteTable
                clientes={clientes?.clientes ?? []}
                onRowClick={handleRowClick}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={clientes?.totalPages || 1}
          totalItems={clientes?.totalItems || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <NuevoClienteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveCliente}
      />
    </div>
  );
}
