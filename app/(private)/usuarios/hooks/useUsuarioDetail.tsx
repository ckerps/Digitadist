import { usuariosApi } from "@/api/usuarios.api";
import { Usuario, UpdateUsuario } from "@/types/usuario";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseUsuarioDetailReturn {
  usuario: Usuario | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  updateUsuario: (id: number, usuario: UpdateUsuario) => Promise<Usuario>;
  deleteUsuario: (id: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  refetchDetail: () => Promise<QueryObserverResult<Usuario, Error>>;
}

export function useUsuarioDetail({ usuarioId }: { usuarioId: number }): UseUsuarioDetailReturn {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ['usuarios:detail', usuarioId],
    queryFn: () => usuariosApi.getById(usuarioId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (detailQuery.error) {
      toast.error(`Error al cargar usuario: ${(detailQuery.error as Error).message}`);
    }
  }, [detailQuery.error]);

  const updateMutation = useMutation({
    mutationFn: ({ id, usuario }: { id: number; usuario: UpdateUsuario }) =>
      usuariosApi.update(id, usuario),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios:list'] });
      queryClient.refetchQueries({ queryKey: ['usuarios:detail', variables.id] });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar usuario: ${(error as Error).message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usuariosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios:list'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios:detail'] });
      toast.success('Usuario eliminado correctamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar usuario: ${(error as Error).message}`);
    },
  });

  const updateUsuario = useCallback(
    async (id: number, usuario: UpdateUsuario) => {
      return updateMutation.mutateAsync({ id, usuario });
    },
    [updateMutation]
  );

  const deleteUsuario = useCallback(
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
    usuario: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    updateUsuario,
    deleteUsuario,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetchDetail,
  };
}
