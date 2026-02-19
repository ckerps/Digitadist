
import { pedidosApi } from "@/api/pedidos.api";
import { productosApi } from "@/api/productos.api";
import { NuevoPedido, Pedido, PedidosPaginado } from "@/types/pedido";
import { Producto, ProductosPaginado } from "@/types/producto";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseProductosReturn {
  productos: ProductosPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  refetchList: () => Promise<QueryObserverResult<ProductosPaginado, Error>>;
}

export function useProductos({filters, itemsPerPage, currentPage}: { filters?: Partial<Producto>, itemsPerPage: number, currentPage: number }): UseProductosReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['productos:list', currentPage, itemsPerPage, filters],
    queryFn: () => productosApi.getAll({ filters, itemsPerPage, currentPage }),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (listQuery.error) {
      toast.error(`Error al cargar productos: ${(listQuery.error as Error).message}`);
    }
  }, [listQuery.error]);

  const refetchList = useCallback(
    () => listQuery.refetch(),
    [listQuery]
  );


  return {
    productos: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    refetchList,
  };
}
