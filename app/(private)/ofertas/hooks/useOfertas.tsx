"use client";

import { ofertasApi } from "@/api/ofertas.api";
import { OfertaConProducto, OfertaPaginada, NuevaOferta, ActualizarOferta, RenovarOferta, FiltrosOferta } from "@/types/oferta";
import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryObserverResult,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseOfertasReturn {
  ofertas: OfertaConProducto[];
  isLoadingList: boolean;
  errorList: Error | null;
  paginacion: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  createOferta: (oferta: NuevaOferta) => Promise<OfertaConProducto>;
  updateOferta: (id: number, data: ActualizarOferta) => Promise<OfertaConProducto>;
  renovarOferta: (id: number, datos: RenovarOferta) => Promise<OfertaConProducto>;
  deleteOferta: (id: number) => Promise<void>;
  refetchList: () => Promise<QueryObserverResult<OfertaPaginada, Error>>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useOfertas(options?: {
  itemsPerPage?: number;
  currentPage?: number;
  filtros?: FiltrosOferta;
}): UseOfertasReturn {
  const queryClient = useQueryClient();
  const itemsPerPage = options?.itemsPerPage ?? 10;
  const currentPage = options?.currentPage ?? 1;
  const filtros = options?.filtros;

  const listQuery = useQuery({
    queryKey: ["ofertas:list", currentPage, itemsPerPage, filtros],
    queryFn: () =>
      ofertasApi.getAll(itemsPerPage, currentPage, filtros),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (oferta: NuevaOferta) => ofertasApi.create(oferta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas:list"] });
      toast.success("Oferta creada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear oferta");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarOferta }) =>
      ofertasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas:list"] });
      queryClient.invalidateQueries({ queryKey: ["ofertas:detail"] });
      toast.success("Oferta actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar oferta");
    },
  });

  const renovarMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: RenovarOferta }) =>
      ofertasApi.renovar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas:list"] });
      queryClient.invalidateQueries({ queryKey: ["ofertas:detail"] });
      toast.success("Oferta renovada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al renovar oferta");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ofertasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ofertas:list"] });
      toast.success("Oferta eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar oferta");
    },
  });

  const createOferta = useCallback(
    async (oferta: NuevaOferta) => {
      return createMutation.mutateAsync(oferta);
    },
    [createMutation]
  );

  const updateOferta = useCallback(
    async (id: number, data: ActualizarOferta) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const renovarOferta = useCallback(
    async (id: number, datos: RenovarOferta) => {
      return renovarMutation.mutateAsync({ id, datos });
    },
    [renovarMutation]
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

  const data = listQuery.data ?? {
    ofertas: [],
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
    itemsPerPage,
  };

  return {
    ofertas: data.ofertas,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    paginacion: {
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalItems: data.totalItems,
      itemsPerPage: data.itemsPerPage,
    },
    createOferta,
    updateOferta,
    renovarOferta,
    deleteOferta,
    refetchList,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending || renovarMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
