'use client';

import { ofertasApi } from "@/api/ofertas.api";
import { ActualizarOferta, FiltrosOferta, NuevaOferta, OfertaConProducto, OfertaPaginada } from "@/types/oferta";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseOfertasCompleteReturn {
  ofertas: OfertaPaginada | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  
  createOferta: (oferta: NuevaOferta) => Promise<OfertaConProducto>;
  isCreating: boolean;
  
  updateOferta: (id: number, oferta: ActualizarOferta) => Promise<OfertaConProducto>;
  isUpdating: boolean;
  
  deleteOferta: (id: number) => Promise<void>;
  isDeleting: boolean;
  
  refetchList: () => Promise<QueryObserverResult<OfertaPaginada, Error>>;
}

export function useOfertasComplete(
  { itemsPerPage = 15, currentPage = 1, filters }: 
  { itemsPerPage?: number; currentPage?: number; filters?: FiltrosOferta } = {}
): UseOfertasCompleteReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['ofertas:list', currentPage, itemsPerPage, filters],
    queryFn: () => ofertasApi.getAll(itemsPerPage, currentPage, filters),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (oferta: NuevaOferta) => ofertasApi.create(oferta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      toast.success('Oferta creada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear oferta: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarOferta }) =>
      ofertasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      toast.success('Oferta actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar oferta: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ofertasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      toast.success('Oferta desactivada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al desactivar oferta: ${error.message}`);
    },
  });

  const createOferta = useCallback(
    async (oferta: NuevaOferta) => {
      return createMutation.mutateAsync(oferta);
    },
    [createMutation]
  );

  const updateOferta = useCallback(
    async (id: number, oferta: ActualizarOferta) => {
      return updateMutation.mutateAsync({ id, data: oferta });
    },
    [updateMutation]
  );

  const deleteOferta = useCallback(
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
    ofertas: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    
    createOferta,
    isCreating: createMutation.isPending,
    
    updateOferta,
    isUpdating: updateMutation.isPending,
    
    deleteOferta,
    isDeleting: deleteMutation.isPending,
    
    refetchList,
  };
}
