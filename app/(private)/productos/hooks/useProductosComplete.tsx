'use client';

import { productosApi } from "@/api/productos.api";
import { NuevoProducto, Producto, ProductosPaginado, UpdateProducto, FiltrosProducto } from "@/types/producto";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseProductosCompleteReturn {
  // Queries
  productos: ProductosPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  
  // Mutations
  createProducto: (producto: NuevoProducto) => Promise<Producto>;
  isCreating: boolean;
  
  updateProducto: (id: number, producto: UpdateProducto) => Promise<Producto>;
  isUpdating: boolean;
  
  deleteProducto: (id: number) => Promise<void>;
  isDeleting: boolean;
  
  // Utilities
  refetchList: () => Promise<QueryObserverResult<ProductosPaginado, Error>>;
}

export function useProductosComplete(
  { itemsPerPage = 15, currentPage = 1, filters }: 
  { itemsPerPage?: number; currentPage?: number; filters?: FiltrosProducto } = {}
): UseProductosCompleteReturn {
  const queryClient = useQueryClient();

  // GET ALL
  const listQuery = useQuery({
    queryKey: ['productos:list', currentPage, itemsPerPage, filters],
    queryFn: () => productosApi.getAll({ filters, itemsPerPage, currentPage }),
    staleTime: 1000 * 60 * 5,
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: (producto: NuevoProducto) => productosApi.create(producto),
    onSuccess: () => {
      toast.success('Producto creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['productos:list'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear producto: ${error.message}`);
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProducto }) =>
      productosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos:list'] });
      toast.success('Producto actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar producto: ${error.message}`);
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos:list'] });
      toast.success('Producto desactivado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al desactivar producto: ${error.message}`);
    },
  });

  const createProducto = useCallback(
    async (producto: NuevoProducto) => {
      return createMutation.mutateAsync(producto);
    },
    [createMutation]
  );

  const updateProducto = useCallback(
    async (id: number, producto: UpdateProducto) => {
      return updateMutation.mutateAsync({ id, data: producto });
    },
    [updateMutation]
  );

  const deleteProducto = useCallback(
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
    productos: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    
    createProducto,
    isCreating: createMutation.isPending,
    
    updateProducto,
    isUpdating: updateMutation.isPending,
    
    deleteProducto,
    isDeleting: deleteMutation.isPending,
    
    refetchList,
  };
}
