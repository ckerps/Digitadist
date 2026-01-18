'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClienteTable,
  ClienteFilters,
  ClienteForm,
  Pagination,
  MobileClienteTable,
} from './components';
import { useClientes } from './hooks/useClientes';
import { NuevoCliente } from '@/types/cliente';
import { Spinner } from '../../components/ui/spinner';
import ErrorPage from '../../error';
import LoadingPage from '../../loading';
import ClientSkeleton from './components/ClientSkeleton';

export default function ClientesPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { clientes, isLoadingList, errorList, createCliente } = useClientes({ itemsPerPage, currentPage });

  const handleRowClick = (id: number) => {
    router.push(`/clientes/${id}`);
  };

  const handleSaveCliente = async (cliente: NuevoCliente) => {
    try {
      await createCliente(cliente);
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  if (isLoadingList || !clientes) {
    return (
      <LoadingPage />
    );
  }

  if (errorList) {
    return (
      <ErrorPage message={errorList.message} />
    );
  }

  return (
    <div className="h-full w-full">
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Clientes</h1>
        </div>

        <div className=" rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
          <ClienteFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onNewClienteClick={() => setIsModalOpen(true)}
          />

          <div className='hidden md:block'>
            <ClienteTable
              clientes={clientes?.clientes ?? []}
              onRowClick={handleRowClick}
            />
          </div>

          <div className='block md:hidden'>
            <MobileClienteTable
              clientes={clientes?.clientes ?? []}
              onRowClick={handleRowClick}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={clientes?.totalPages || 1}
            totalItems={clientes?.totalItems || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
      </div>

      <ClienteForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveCliente}
      />
    </div>
  );
}
