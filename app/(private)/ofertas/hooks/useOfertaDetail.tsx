import { ofertasApi } from "@/api/ofertas.api";
import { Oferta, ActualizarOferta, RenovarOferta, OfertaConProducto } from "@/types/oferta";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseOfertaDetailReturn {
  oferta: OfertaConProducto | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  errorRenovar: Error | null;
  updateOferta: (id: number, data: ActualizarOferta) => Promise<Oferta>;
  deleteOferta: (id: number) => Promise<void>;
  renovarOferta: (id: number, datos: RenovarOferta) => Promise<Oferta>;
  isUpdating: boolean;
  isDeleting: boolean;
  isRenovando: boolean;
  refetchDetail: () => Promise<QueryObserverResult<Oferta, Error>>;
}

export function useOfertaDetail({ofertaId}: { ofertaId: number}): UseOfertaDetailReturn {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ['ofertas:detail', ofertaId],
    queryFn: () => ofertasApi.getById(ofertaId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (detailQuery.error) {
      toast.error(`Error al cargar oferta: ${(detailQuery.error as Error).message}`);
    }
  }, [detailQuery.error]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarOferta }) =>
      ofertasApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      queryClient.refetchQueries({ queryKey: ['ofertas:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ofertasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      queryClient.invalidateQueries({ queryKey: ['ofertas:detail'] });
    },
  });

  const renovarMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: RenovarOferta }) =>
      ofertasApi.renovar(id, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ofertas:list'] });
      queryClient.refetchQueries({ queryKey: ['ofertas:detail', variables.id] });
    },
  });

  const updateOferta = useCallback(
    async (id: number, data: ActualizarOferta) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteOferta = useCallback(
    async (id: number) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const renovarOferta = useCallback(
    async (id: number, datos: RenovarOferta) => {
      return renovarMutation.mutateAsync({ id, datos });
    },
    [renovarMutation]
  );

  const refetchDetail = useCallback(
    () => detailQuery.refetch(),
    [detailQuery]
  );

  return {
    oferta: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    errorRenovar: renovarMutation.error as Error | null,
    updateOferta,
    deleteOferta,
    renovarOferta,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRenovando: renovarMutation.isPending,
    refetchDetail,
  };
}
