import { clientesApi } from "@/api/clientes.api";
import { Cliente, ClientePaginado, NuevoCliente } from "@/types/cliente";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface UseClientesReturn {
  clientes: ClientePaginado | undefined;
  cliente: Cliente | undefined;
  
  isLoadingList: boolean;
  isLoadingDetail: boolean;
  
  errorList: Error | null;
  errorDetail: Error | null;
  errorCreate: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  
  createCliente: (cliente: NuevoCliente) => Promise<Cliente>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<Cliente>;
  deleteCliente: (id: string) => Promise<void>;
  
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  refetchList: () => Promise<QueryObserverResult<ClientePaginado, Error>>;
  refetchDetail: () => Promise<QueryObserverResult<Cliente, Error>>;
}

export function useClientes(clienteId?: string): UseClientesReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['clientes:list'],
    queryFn: () => clientesApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const detailQuery = useQuery({
    queryKey: ['clientes:detail', clienteId],
    queryFn: () => clientesApi.getById(clienteId!),
    enabled: !!clienteId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (cliente: NuevoCliente) => clientesApi.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, cliente }: { id: string; cliente: Partial<Cliente> }) =>
      clientesApi.update(id, cliente),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      queryClient.invalidateQueries({ queryKey: ['clientes:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      queryClient.invalidateQueries({ queryKey: ['clientes:detail'] });
    },
  });

  const createCliente = useCallback(
    async (cliente: NuevoCliente) => {
      return createMutation.mutateAsync(cliente);
    },
    [createMutation]
  );

  const updateCliente = useCallback(
    async (id: string, cliente: Partial<Cliente>) => {
      return updateMutation.mutateAsync({ id, cliente });
    },
    [updateMutation]
  );

  const deleteCliente = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const refetchList = useCallback(
    () => listQuery.refetch(),
    [listQuery]
  );

  const refetchDetail = useCallback(
    () => detailQuery.refetch(),
    [detailQuery]
  );

  return {
    clientes: listQuery.data,
    cliente: detailQuery.data,
    isLoadingList: listQuery.isLoading,
    isLoadingDetail: detailQuery.isLoading,
    errorList: listQuery.error as Error | null,
    errorDetail: detailQuery.error as Error | null,
    errorCreate: createMutation.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    createCliente,
    updateCliente,
    deleteCliente,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchList,
    refetchDetail,
  };
}
