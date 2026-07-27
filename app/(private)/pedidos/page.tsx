'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePedidos } from './hooks/usePedidos';
import { itemsPerPage } from '../utils';
import ErrorPage from '../../error';
import { MobilePedidosTable, PedidoFilters, PedidosTable, PedidosTableSkeleton, MobilePedidosTableSkeleton } from './components';
import { Pagination } from '../shared/Pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FiltrosPedido } from '@/types/pedido';
import { EnumEstadoPago, EnumEstadoPedido } from '@prisma/client';

export default function PedidosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosPedido>({
    estado: undefined,
    estado_pago: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { pedidos, isLoadingList, errorList } = usePedidos({ itemsPerPage, currentPage, filters: filtros });

  const handleRowClick = (id: number) => {
    router.push(`/pedidos/${id}`);
  };

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEstadoFilterChange = (value: string) => {
    setFiltros({ ...filtros, estado: value === 'all' ? undefined : value as EnumEstadoPedido });
    setCurrentPage(1);
  };

  const handlePagoFilterChange = (value: string) => {
    setFiltros({ ...filtros, estado_pago: value === 'all' ? undefined : value as EnumEstadoPago });
    setCurrentPage(1);
  };

  if (errorList) {
    return (
      <ErrorPage message={errorList.message} />
    );
  }

  return (
    <div className="h-full w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestioná los pedidos de la distribuidora</p>
        </div>
        <Button
          onClick={() => router.push('/pedidos/nuevo')}
          size="lg"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      <div className="">
        <PedidoFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filtros={filtros}
          onEstadoFilterChange={handleEstadoFilterChange}
          onPagoFilterChange={handlePagoFilterChange}
        />
      </div>

      {/* Data Table Section */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
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
      </div>

      {/* Pagination */}
      <div className="flex flex-col w-full mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={pedidos?.totalPages ?? 1}
          totalItems={pedidos?.totalItems ?? 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
