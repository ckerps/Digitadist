import { pedidosApi } from "@/api/pedidos.api";
import { productosApi } from "@/api/productos.api";
import { PedidosPaginado } from "@/types/pedido";
import { ProductosPaginado } from "@/types/producto";
import { QueryObserverResult, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface useProductosByPedidoReturn {
  productos: ProductosPaginado;
  isLoading: boolean;
  error: Error | null;
  refetchPedidos: () => Promise<QueryObserverResult<ProductosPaginado, Error>>;

}

export function useProductosByPedido({pedidoId, itemsPerPage, currentPage}: {pedidoId?: number, itemsPerPage?: number, currentPage?: number}): useProductosByPedidoReturn {

  const productosQuery = useSuspenseQuery({
    queryKey: ['productosByPedido:list', itemsPerPage, currentPage, pedidoId],
    queryFn: () => productosApi.getAll({ p }, itemsPerPage, currentPage),
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
