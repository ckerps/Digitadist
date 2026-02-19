import { pedidosApi } from "@/api/pedidos.api";
import { PedidosPaginado } from "@/types/pedido";
import { QueryObserverResult, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface UsePedidosByClienteReturn {
  pedidos: PedidosPaginado;
  isLoading: boolean;
  error: Error | null;
  refetchPedidos: () => Promise<QueryObserverResult<PedidosPaginado, Error>>;

}

export function usePedidosByCliente({clienteId, itemsPerPage, currentPage}: {clienteId?: number, itemsPerPage?: number, currentPage?: number}): UsePedidosByClienteReturn {

  const pedidosQuery = useSuspenseQuery({
    queryKey: ['pedidosByCliente:list', itemsPerPage, currentPage, clienteId],
    queryFn: () => pedidosApi.getAll({filters: {cliente_id: clienteId}, itemsPerPage, currentPage}),
    staleTime: 1000 * 60 * 5,
  });


  const refetchDetail = useCallback(
    () => pedidosQuery.refetch(),
    [pedidosQuery]
  );


  return {
    pedidos: pedidosQuery.data as PedidosPaginado,
    isLoading: pedidosQuery.isLoading,
    error: pedidosQuery.error as Error | null,
    refetchPedidos: refetchDetail,
  };
}
