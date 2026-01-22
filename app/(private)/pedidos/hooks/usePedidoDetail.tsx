import { pedidosApi } from "@/api/pedidos.api";
import { Pedido } from "@/types/pedido";
import { QueryObserverResult, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface UsePedidosReturn {
  pedido: Pedido | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  updatePedido: (id: number, pedido: Partial<Pedido>) => Promise<Pedido>;
  deletePedido: (id: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  refetchDetail: () => Promise<QueryObserverResult<Pedido, Error>>;
}

export function usePedidoDetail({pedidoId}: { pedidoId: number}): UsePedidosReturn {
  const queryClient = useQueryClient();

  const detailQuery = useSuspenseQuery({
    queryKey: ['pedidos:detail', pedidoId],
    queryFn: () => pedidosApi.getById(pedidoId),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pedido }: { id: number; pedido: Partial<Pedido> }) =>
      pedidosApi.update(id, pedido),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.refetchQueries({ queryKey: ['pedidos:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pedidosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos:detail'] });
    },
  });

  const updatePedido = useCallback(
    async (id: number, pedido: Partial<Pedido>) => {
      return updateMutation.mutateAsync({ id, pedido });
    },
    [updateMutation]
  );

  const deletePedido = useCallback(
    async (id: number) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );
  const refetchDetail = useCallback(
    () => detailQuery.refetch(),
    [detailQuery]
  );

  return {
    pedido: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    updatePedido,
    deletePedido,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchDetail,
  };
}
