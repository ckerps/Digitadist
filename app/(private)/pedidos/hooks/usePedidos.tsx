
import { pedidosApi } from "@/api/pedidos.api";
import { FiltrosPedido, PedidosPaginado } from "@/types/pedido";
import { QueryObserverResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UsePedidosReturn {
  pedidos: PedidosPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  refetchList: () => Promise<QueryObserverResult<PedidosPaginado, Error>>;
}

export function usePedidos({itemsPerPage, currentPage, filters}: { itemsPerPage: number, currentPage: number, filters?: FiltrosPedido }): UsePedidosReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['pedidos:list', currentPage, itemsPerPage, filters],
    queryFn: () => pedidosApi.getAll({ itemsPerPage, currentPage, filters }),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (listQuery.error) {
      toast.error(`Error al cargar pedidos: ${(listQuery.error as Error).message}`);
    }
  }, [listQuery.error]);

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
