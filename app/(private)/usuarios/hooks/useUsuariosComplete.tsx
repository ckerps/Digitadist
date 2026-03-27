'use client';

import { usuariosApi } from "@/api/usuarios.api";
import { NuevoUsuario, UpdateUsuario, Usuario, UsuarioPaginado, FiltrosUsuario } from "@/types/usuario";
import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseUsuariosCompleteReturn {
  usuarios: UsuarioPaginado | undefined;
  isLoadingList: boolean;
  errorList: Error | null;
  
  createUsuario: (usuario: NuevoUsuario) => Promise<Usuario>;
  isCreating: boolean;
  
  updateUsuario: (id: number, usuario: UpdateUsuario) => Promise<Usuario>;
  isUpdating: boolean;
  
  deleteUsuario: (id: number) => Promise<void>;
  isDeleting: boolean;
  
  refetchList: () => Promise<QueryObserverResult<UsuarioPaginado, Error>>;
}

export function useUsuariosComplete(
  { itemsPerPage = 15, currentPage = 1, filters }: 
  { itemsPerPage?: number; currentPage?: number; filters?: FiltrosUsuario } = {}
): UseUsuariosCompleteReturn {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['usuarios:list', currentPage, itemsPerPage, filters],
    queryFn: () => usuariosApi.getAll({ itemsPerPage, currentPage, filters }),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (usuario: NuevoUsuario) => usuariosApi.create(usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios:list'] });
      toast.success('Usuario creado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear usuario: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUsuario }) =>
      usuariosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios:list'] });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar usuario: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usuariosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios:list'] });
      toast.success('Usuario desactivado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al desactivar usuario: ${error.message}`);
    },
  });

  const createUsuario = useCallback(
    async (usuario: NuevoUsuario) => {
      return createMutation.mutateAsync(usuario);
    },
    [createMutation]
  );

  const updateUsuario = useCallback(
    async (id: number, usuario: UpdateUsuario) => {
      return updateMutation.mutateAsync({ id, data: usuario });
    },
    [updateMutation]
  );

  const deleteUsuario = useCallback(
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
    usuarios: listQuery.data,
    isLoadingList: listQuery.isLoading,
    errorList: listQuery.error as Error | null,
    
    createUsuario,
    isCreating: createMutation.isPending,
    
    updateUsuario,
    isUpdating: updateMutation.isPending,
    
    deleteUsuario,
    isDeleting: deleteMutation.isPending,
    
    refetchList,
  };
}
