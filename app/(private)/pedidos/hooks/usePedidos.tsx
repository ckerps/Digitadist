
import { pedidosApi } from "@/api/pedidos.api";
import { NuevoPedido, Pedido, PedidosPaginado } from "@/types/pedido";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface UsePedidosReturn {
  pedidos: PedidosPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  refetchList: () => Promise<QueryObserverResult<PedidosPaginado, Error>>;
}

export function usePedidos({itemsPerPage, currentPage}: { itemsPerPage: number, currentPage: number }): UsePedidosReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['pedidos:list', currentPage],
    queryFn: () => pedidosApi.getAll({ itemsPerPage, currentPage }),
    staleTime: 1000 * 60 * 5,
  });

  const refetchList = useCallback(
    () => listQuery.refetch(),
    [listQuery]
  );


  return {
    pedidos: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    refetchList,
  };
}
