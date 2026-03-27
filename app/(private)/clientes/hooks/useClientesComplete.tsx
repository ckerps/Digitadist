'use client';

import { clientesApi } from "@/api/clientes.api";
import { Cliente, ClientePaginado, FiltrosCliente, NuevoCliente, UpdateCliente } from "@/types/cliente";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseClientesCompleteReturn {
  clientes: ClientePaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  
  createCliente: (cliente: NuevoCliente) => Promise<Cliente>;
  isCreating: boolean;
  
  updateCliente: (id: number, cliente: UpdateCliente) => Promise<Cliente>;
  isUpdating: boolean;
  
  deleteCliente: (id: number) => Promise<void>;
  isDeleting: boolean;
  
  refetchList: () => Promise<QueryObserverResult<ClientePaginado, Error>>;
}

export function useClientesComplete(
  { itemsPerPage = 15, currentPage = 1, filters }: 
  { itemsPerPage?: number; currentPage?: number; filters?: FiltrosCliente } = {}
): UseClientesCompleteReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['clientes:list', currentPage, itemsPerPage, filters],
    queryFn: () => clientesApi.getAll({ itemsPerPage, currentPage, filters }),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (cliente: NuevoCliente) => clientesApi.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      toast.success('Cliente creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear cliente: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCliente }) =>
      clientesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      toast.success('Cliente actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar cliente: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      toast.success('Cliente desactivado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al desactivar cliente: ${error.message}`);
    },
  });

  const createCliente = useCallback(
    async (cliente: NuevoCliente) => {
      return createMutation.mutateAsync(cliente);
    },
    [createMutation]
  );

  const updateCliente = useCallback(
    async (id: number, cliente: UpdateCliente) => {
      return updateMutation.mutateAsync({ id, data: cliente });
    },
    [updateMutation]
  );

  const deleteCliente = useCallback(
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
    clientes: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    
    createCliente,
    isCreating: createMutation.isPending,
    
    updateCliente,
    isUpdating: updateMutation.isPending,
    
    deleteCliente,
    isDeleting: deleteMutation.isPending,
    
    refetchList,
  };
}
