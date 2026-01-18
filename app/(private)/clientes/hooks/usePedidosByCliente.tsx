import { pedidosApi } from "@/api/pedidos.api";
import { Pedido, PedidosPaginado } from "@/types/pedido";
import { QueryObserverResult, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface UsePedidosByClienteReturn {
  pedidos: PedidosPaginado | undefined;
  isLoading: boolean;
  error: Error | null;
  refetchPedidos: () => Promise<QueryObserverResult<PedidosPaginado, Error>>;

}
 
export function usePedidosByCliente(clienteId?: string): UsePedidosByClienteReturn {
  const queryClient = useQueryClient();

  const pedidosQuery = useSuspenseQuery({
    queryKey: ['pedidosByCliente:list'],
    queryFn: () => pedidosApi.getAll({ clienteId }),
    staleTime: 1000 * 60 * 5,
  });


  const refetchDetail = useCallback(
    () => pedidosQuery.refetch(),
    [pedidosQuery]
  );

  return {
    pedidos: pedidosQuery.data,
    isLoading: pedidosQuery.isLoading,
    error: pedidosQuery.error as Error | null,
    refetchPedidos: refetchDetail,
  };
}
