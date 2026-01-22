'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePedidos } from './hooks/usePedidos';
import { itemsPerPage } from '../utils';
import { NuevoPedido } from '@/types/pedido';
import LoadingPage from '../../loading';
import ErrorPage from '../../error';
import { MobilePedidosTable, PedidoFilters, PedidosTable } from './components';
import { Pagination } from '../components/Pagination';

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

  if (isLoadingList || !pedidos) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Pedidos</h1>
        </div>

        <div className=" rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
          <PedidoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            estadoFilter={filtros.estadoFilter}
            onEstadoFilterChange={(value) => setFiltros({...filtros, estadoFilter: value})}
            pagoFilter={filtros.pagoFilter}
            onPagoFilterChange={(value) => setFiltros({...filtros, pagoFilter: value})}
            onNewPedidoClick={() => router.push('/pedidos/nuevo')}
          />

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
