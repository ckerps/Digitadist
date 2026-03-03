import { clientesApi } from "@/api/clientes.api";
import { Cliente, UpdateCliente } from "@/types/cliente";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseClientesReturn {
  cliente: Cliente | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  updateCliente: (id: number, cliente: UpdateCliente) => Promise<Cliente>;
  deleteCliente: (id: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  refetchDetail: () => Promise<QueryObserverResult<Cliente, Error>>;
}

export function useClienteDetail({clienteId}: { clienteId: number}): UseClientesReturn {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ['clientes:detail', clienteId],
    queryFn: () => clientesApi.getById(clienteId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (detailQuery.error) {
      toast.error(`Error al cargar cliente: ${(detailQuery.error as Error).message}`);
    }
  }, [detailQuery.error]);

  const updateMutation = useMutation({
    mutationFn: ({ id, cliente }: { id: number; cliente: UpdateCliente }) =>
      clientesApi.update(id, cliente),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      queryClient.refetchQueries({ queryKey: ['clientes:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
      queryClient.invalidateQueries({ queryKey: ['clientes:detail'] });
    },
  });

  const updateCliente = useCallback(
    async (id: number, cliente: UpdateCliente) => {
      console.log(cliente);
      return updateMutation.mutateAsync({ id, cliente });
    },
    [updateMutation]
  );

  const deleteCliente = useCallback(
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
