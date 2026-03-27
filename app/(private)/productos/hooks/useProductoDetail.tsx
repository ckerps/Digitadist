import { productosApi } from "@/api/productos.api";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Producto, UpdateProducto } from "@/types/producto";

interface UseProductoDetailReturn {
  producto: Producto | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  updateProducto: (id: number, producto: UpdateProducto) => Promise<Producto>;
  deleteProducto: (id: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  refetchDetail: () => Promise<QueryObserverResult<Producto, Error>>;
}

export function useProductoDetail({ productoId }: { productoId: number }): UseProductoDetailReturn {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ['productos:detail', productoId],
    queryFn: () => productosApi.getById(productoId),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, producto }: { id: number; producto: UpdateProducto }) =>
      productosApi.update(id, producto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos:list'] });
      queryClient.refetchQueries({ queryKey: ['productos:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos:list'] });
      queryClient.invalidateQueries({ queryKey: ['productos:detail'] });
    },
  });

  const updateProducto = useCallback(
    async (id: number, producto: UpdateProducto) => {
      return updateMutation.mutateAsync({ id, producto });
    },
    [updateMutation]
  );

  const deleteProducto = useCallback(
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
    producto: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    updateProducto,
    deleteProducto,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchDetail,
  };
}
