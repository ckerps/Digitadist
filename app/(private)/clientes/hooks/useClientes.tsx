import { clientesApi } from "@/api/clientes.api";
import { Cliente } from "@prisma/client";
import { ClientePaginado, FiltrosCliente, NuevoCliente } from "@/types/cliente";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseClientesReturn {
  clientes: ClientePaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  errorCreate: Error | null;
  createCliente: (cliente: NuevoCliente) => Promise<Cliente>;
  isCreating: boolean;
  refetchList: () => Promise<QueryObserverResult<ClientePaginado, Error>>;
}

export function useClientes({ itemsPerPage, currentPage, filters}: { itemsPerPage?: number, currentPage?: number, filters?: FiltrosCliente }): UseClientesReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['clientes:list', currentPage, itemsPerPage, filters],
    queryFn: () => clientesApi.getAll({itemsPerPage, currentPage, filters}),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (cliente: NuevoCliente) => clientesApi.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes:list'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear cliente: ${error.message}`);
    },
  });

  const createCliente = useCallback(
    async (cliente: NuevoCliente) => {
      return createMutation.mutateAsync(cliente);
    },
    [createMutation]
  );

  const refetchList = useCallback(
    () => listQuery.refetch(),
    [listQuery]
  );


  return {
    clientes: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    errorCreate: createMutation.error as Error | null,
    createCliente,
    isCreating: createMutation.isPending,
    refetchList,
  };
}
