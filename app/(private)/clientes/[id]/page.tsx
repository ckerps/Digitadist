'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  ClienteInfoCards,
  PedidosTable,
  Pagination,
} from '../components';
import { useRouter } from 'next/navigation';
import { usePedidosByCliente } from '../hooks/usePedidosByCliente';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useClienteDetail } from '../hooks/useClienteDetail';

export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = React.use(params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { cliente } = useClienteDetail({ clienteId: id, pedidos: true });
  const pedidosList = cliente?.pedidos || [];

  console.log(pedidosList)
  console.log(cliente?.pedidos)
  const totalPages = Math.ceil(pedidosList.length / itemsPerPage);
  const paginatedPedidos = pedidosList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen custom-scrollbar overflow-auto w-full">
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => router.push('/clientes')}
            className="mb-4 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Button>
          <div className="flex items-start justify-end">
            <div className="flex gap-2">
              <Button variant="outline" className="border-neutral-300">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Desactivar
              </Button>
            </div>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
          <ClienteInfoCards cliente={cliente!} />
        </Suspense>

        <Card className="border-neutral-200 shadow-lg">
          <CardHeader className="bg-linear-to-r from-neutral-900 to-neutral-800 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Pedidos Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <PedidosTable pedidos={paginatedPedidos} />
            </Suspense>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pedidosList.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
    </div>
  );
}
