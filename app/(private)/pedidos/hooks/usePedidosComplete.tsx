'use client';

import { pedidosApi } from "@/api/pedidos.api";
import { FiltrosPedido, NuevoDetallePedido, NuevoPedido, Pedido, PedidosPaginado, UpdatePedido } from "@/types/pedido";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UsePedidosCompleteReturn {
  pedidos: PedidosPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  
  createPedido: (pedido: NuevoPedido, detalles: NuevoDetallePedido[]) => Promise<Pedido>;
  isCreating: boolean;
  
  updatePedido: (id: number, pedido: UpdatePedido) => Promise<Pedido>;
  isUpdating: boolean;
  
  deletePedido: (id: number) => Promise<void>;
  isDeleting: boolean;
  
  refetchList: () => Promise<QueryObserverResult<PedidosPaginado, Error>>;
}

export function usePedidosComplete(
  { itemsPerPage = 15, currentPage = 1, filters }: 
  { itemsPerPage?: number; currentPage?: number; filters?: FiltrosPedido } = {}
): UsePedidosCompleteReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['pedidos:list', currentPage, itemsPerPage, filters],
    queryFn: () => pedidosApi.getAll({ itemsPerPage, currentPage, filters }),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: ({ pedido, detalles }: { pedido: NuevoPedido; detalles: NuevoDetallePedido[] }) => {
      // El API espera { pedido, detalle }
      return fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido, detalle: detalles }),
        credentials: 'include',
      }).then(res => {
        if (!res.ok) throw new Error('Error al crear pedido');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      toast.success('Pedido creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear pedido: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePedido }) =>
      pedidosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      toast.success('Pedido actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar pedido: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pedidosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      toast.success('Pedido cancelado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al cancelar pedido: ${error.message}`);
    },
  });

  const createPedido = useCallback(
    async (pedido: NuevoPedido, detalles: NuevoDetallePedido[]) => {
      return createMutation.mutateAsync({ pedido, detalles });
    },
    [createMutation]
  );

  const updatePedido = useCallback(
    async (id: number, pedido: UpdatePedido) => {
      return updateMutation.mutateAsync({ id, data: pedido });
    },
    [updateMutation]
  );

  const deletePedido = useCallback(
    async (id: number) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const refetchList = useCallback(
    () => listQuery.refetch(),
    [listQuery]
  );

  return {
    pedidos: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    
    createPedido,
    isCreating: createMutation.isPending,
    
    updatePedido,
    isUpdating: updateMutation.isPending,
    
    deletePedido,
    isDeleting: deleteMutation.isPending,
    
    refetchList,
  };
}
