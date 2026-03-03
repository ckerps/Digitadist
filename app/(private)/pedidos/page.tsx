'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePedidos } from './hooks/usePedidos';
import { itemsPerPage } from '../utils';
import { NuevoPedido } from '@/types/pedido';
import ErrorPage from '../../error';
import { MobilePedidosTable, PedidoFilters, PedidosTable, PedidosTableSkeleton, MobilePedidosTableSkeleton } from './components';
import { Pagination } from '../shared/Pagination';

export default function PedidosPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    estadoFilter: 'all',
    pagoFilter: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { pedidos, isLoadingList, errorList } = usePedidos({ itemsPerPage, currentPage });

  const handleRowClick = (id: number) => {
    router.push(`/pedidos/${id}`);
  };

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEstadoFilterChange = (value: string) => {
    setFiltros({...filtros, estadoFilter: value});
    setCurrentPage(1);
  };

  const handlePagoFilterChange = (value: string) => {
    setFiltros({...filtros, pagoFilter: value});
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
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Pedidos</h1>
        </div>

        <div className=" rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
          <PedidoFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            estadoFilter={filtros.estadoFilter}
            onEstadoFilterChange={handleEstadoFilterChange}
            pagoFilter={filtros.pagoFilter}
            onPagoFilterChange={handlePagoFilterChange}
            onNewPedidoClick={() => router.push('/pedidos/nuevo')}
          />

          {isLoadingList || !pedidos ? (
            <>
              <div className='hidden md:block'>
                <PedidosTableSkeleton rows={itemsPerPage} />
              </div>
              <div className='block md:hidden'>
                <MobilePedidosTableSkeleton rows={5} />
              </div>
            </>
          ) : (
            <>
              <div className='hidden md:block'>
                <PedidosTable
                  pedidos={pedidos?.pedidos ?? []}
                  onRowClick={handleRowClick}
                />
              </div>

              <div className='block md:hidden'>
                <MobilePedidosTable
                  pedidos={pedidos?.pedidos ?? []}
                  onRowClick={handleRowClick}
                />
              </div>
            </>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={pedidos?.totalPages || 1}
            totalItems={pedidos?.totalItems || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
      </div>
    </div>
  );
}
