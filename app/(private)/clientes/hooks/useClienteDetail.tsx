import { clientesApi } from "@/api/clientes.api";
import { Cliente } from "@/types/cliente";
import { QueryObserverResult, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface UseClientesReturn {
  cliente: Cliente | undefined;
  
  isLoadingDetail: boolean;
  
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<Cliente>;
  deleteCliente: (id: string) => Promise<void>;
  
  isUpdating: boolean;
  isDeleting: boolean;
  
  refetchDetail: () => Promise<QueryObserverResult<Cliente, Error>>;
}

export function useClienteDetail({clienteId, pedidos}: { clienteId?: string, pedidos?: boolean}): UseClientesReturn {
  const queryClient = useQueryClient();

  const detailQuery = useSuspenseQuery({
    queryKey: ['clientes:detail', clienteId],
    queryFn: () => clientesApi.getById(clienteId!, pedidos!),
    staleTime: 1000 * 60 * 5,
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
  const refetchDetail = useCallback(
    () => detailQuery.refetch(),
    [detailQuery]
  );

  return {
    cliente: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    updateCliente,
    deleteCliente,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchDetail,
  };
}
