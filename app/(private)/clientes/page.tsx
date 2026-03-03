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
    <div className="h-full w-full">
        <div className="my-1 ml-10 md:ml-0">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Clientes</h1>
        </div>

        <div className="md:rounded-xl md:shadow-lg md:border border-neutral-200 overflow-hidden">
          <ClienteFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filterType={filterType}
            onFilterTypeChange={handleFilterTypeChange}
            onNewClienteClick={() => setIsModalOpen(true)}
          />

          {isLoadingList || !clientes ? (
            <>
              <div className='hidden md:block'>
                <ClienteTableSkeleton rows={itemsPerPage} />
              </div>
              <div className='block mt-2 md:mt-0 md:hidden'>
                <MobileClienteTableSkeleton rows={5} />
              </div>
            </>
          ) : (
            <>
              <div className='hidden md:block'>
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
